/* eslint-disable prettier/prettier */
import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { useCombobox, useMultipleSelection, UseMultipleSelectionProps } from 'downshift'
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

export interface ChakraMultipleCreateProps<T extends Item> extends UseMultipleSelectionProps<T> {
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

  const { getSelectedItemProps, getDropdownProps, addSelectedItem, removeSelectedItem, selectedItems } = useMultipleSelection(downshiftProps)

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
      <label {...getLabelProps({})}>
        Choose some fruits:
            </label>
      <div>
        <div className='my-2'>
          {selectedItems.map((selectedItem, index) => (
            <span
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem.label}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
                type='button'
                aria-label='Remove small badge'
              >
                &#10005;
              </button>
            </span>
          ))}
        </div>
        <div {...getComboboxProps()}>
          <input
            {...getInputProps(
              getDropdownProps({
                placeholder,
                onClick: isOpen ? () => { } : openMenu,
                onFocus: isOpen ? () => { } : openMenu,
                ref: disclosureRef
              })
            )}
          />
          <div>
            <button {...getToggleButtonProps()} aria-label='toggle menu'> &#8595; </button>
          </div>
        </div>
        <div
          style={styles.popper}
          {...attributes.popper}
          {...getMenuProps({ ref: popoverRef, })}
        >
          <ul>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  className={cc({
                    'p-2 text-sm bg-white border-b': true,
                    'bg-gray-100':
                      highlightedIndex === index
                  })}
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {isCreating ? (
                    <p>
                      <span>Create</span>{' '}
                      <span>
                        {item.label}
                      </span>
                    </p>
                  ) : (
                      <div>
                        {selectedItemValues.includes(
                          item.value
                        ) && (
                            <span
                              role='img'
                              aria-label='Selected'
                            >
                              x
                            </span>
                          )}
                        <Highlighter
                          autoEscape
                          searchWords={[inputValue || '']}
                          textToHighlight={itemRenderer(
                            item
                          )}
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
