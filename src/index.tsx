/* eslint-disable prettier/prettier */
import * as React from 'react'
import {
  useCombobox,
  useMultipleSelection,
  // eslint-disable-next-line no-unused-vars
  UseMultipleSelectionProps
} from 'downshift'
import matchSorter from 'match-sorter'
import Highlighter from 'react-highlight-words'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import cc from 'classcat'
import { usePopper } from 'react-popper'

function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] })
}

function defaultItemRenderer<T extends Item>(selected: T) {
  return selected.label
}

export interface Item {
  label: string
  value: string
}

export interface ChakraMultipleCreateProps<T extends Item>
  extends UseMultipleSelectionProps<T> {
  items: T[]
  placeholder: string
  onCreateItem?: (item: T) => void
  itemRenderer?: (item: T) => string
  emptyState?: (inputValue: string) => React.ReactNode
  optionFilterFunc?: (items: T[], inputValue: string) => T[]
}

export const ChakraMultipleCreate = <T extends Item>(
  props: ChakraMultipleCreateProps<T>
): React.ReactElement<ChakraMultipleCreateProps<T>> => {
  const {
    items,
    optionFilterFunc = defaultOptionFilterFunc,
    itemRenderer = defaultItemRenderer,
    placeholder,
    onCreateItem,
    ...downshiftProps
  } = props
  const [isCreating, setIsCreating] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [inputItems, setInputItems] = React.useState<T[]>(items)
  const disclosureRef = React.useRef(null)
  const popoverRef = React.useRef(null)
  const { styles, attributes, forceUpdate } = usePopper(
    disclosureRef.current,
    popoverRef.current,
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }
      ]
    }
  )

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems
  } = useMultipleSelection(downshiftProps)

  const selectedItemValues = selectedItems.map((item) => item.value)

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    selectItem,
    setHighlightedIndex
  } = useCombobox({
    inputValue,
    selectedItem: undefined,
    items: inputItems,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      const filteredItems = optionFilterFunc(items, inputValue || '')

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false)
      }

      if (!selectedItem) {
        setInputItems(filteredItems)
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: false
          }
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue,
            isOpen: true
          }
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            inputValue
          }
        default:
          return changes
      }
    },
    // @ts-ignore
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || '')
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            if (selectedItemValues.includes(selectedItem.value)) {
              removeSelectedItem(selectedItem)
            } else {
              if (onCreateItem && isCreating) {
                onCreateItem(selectedItem)
                setIsCreating(false)
                setInputItems(items)
                setInputValue('')
              } else {
                addSelectedItem(selectedItem)
              }
            }

            // @ts-ignore
            selectItem(null)
          }
          break
        default:
          break
      }
    }
  })

  React.useEffect(() => {
    if (inputItems.length === 0) {
      setIsCreating(true)
      // @ts-ignore
      setInputItems([{ label: `${inputValue}`, value: inputValue }])
      setHighlightedIndex(0)
    }
  }, [inputItems, setIsCreating, setHighlightedIndex, inputValue])

  useDeepCompareEffect(() => {
    setInputItems(items)
  }, [items])

  React.useEffect(() => {
    if (selectedItems && forceUpdate) {
      forceUpdate()
    }
  }, [selectedItems, forceUpdate])

  return (
    <div className='relative'>
      <label
        {...getLabelProps({
          className: 'font-medium text-gray-700 text-xs mb-2 block'
        })}
      >
        Choose some fruits:
      </label>
      <div>
        <div className='my-2'>
          {selectedItems.map((selectedItem, index) => (
            <span
              key={`selected-item-${index}`}
              className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium leading-4 bg-indigo-100 text-indigo-800 focus:outline-none focus:shadow-outline mr-2'
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem.label}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
                type='button'
                className='flex-shrink-0 ml-1 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700'
                aria-label='Remove small badge'
              >
                &#10005;
              </button>
            </span>
          ))}
        </div>
        <div className='relative' {...getComboboxProps()}>
          <input
            {...getInputProps(
              getDropdownProps({
                className:
                  'w-full p-2 text-sm focus:outline-none focus:shadow-outline rounded border border-gray-400',
                placeholder,
                onClick: isOpen ? () => { } : openMenu,
                onFocus: isOpen ? () => { } : openMenu,
                ref: disclosureRef
              })
            )}
          />
          <div className='absolute right-0 top-0 bottom-0 flex items-center justify-center'>
            <button
              className='text-gray-600 px-3 h-full focus:outline-none focus:shadow-outline'
              {...getToggleButtonProps()}
              aria-label='toggle menu'
            >
              &#8595;
            </button>
          </div>
        </div>
        <div
          style={styles.popper}
          {...attributes.popper}
          {...getMenuProps({ ref: popoverRef, className: ' w-full' })}
        >
          <ul className='bg-white shadow-md'>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  className={cc({
                    'p-2 text-sm bg-white border-b': true,
                    'bg-gray-100': highlightedIndex === index
                  })}
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {isCreating ? (
                    <p>
                      <span>Create</span>{' '}
                      <span className='font-medium bg-yellow-300 text-yellow-900'>
                        {item.label}
                      </span>
                    </p>
                  ) : (
                      <div className='flex items-center space-x-2'>
                        {selectedItemValues.includes(item.value) && (
                          <span role='img' aria-label='Selected'>
                            x
                          </span>
                        )}
                        <Highlighter
                          autoEscape
                          searchWords={[inputValue || '']}
                          textToHighlight={itemRenderer(item)}
                          highlightClassName='bg-yellow-300'
                        />
                      </div>
                    )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
