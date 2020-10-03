/* eslint-disable prettier/prettier */
import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { useCombobox, useMultipleSelection, UseMultipleSelectionProps } from 'downshift'
import matchSorter from 'match-sorter'
import Highlighter from 'react-highlight-words'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import cc from 'classcat'
import {
  Input, Button, List, ListItem, Text,
  FormLabel, Box,
  ThemeProvider,
  InputProps, BoxProps,
  FlexProps,
} from '@chakra-ui/core'

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
  optionFilterFunc?: (items: T[], inputValue: string) => T[],
  inputStyleProps?: InputProps
  inputIconStyleProps?: InputProps
  tagStyleProps?: InputProps
  selectedIconProps?: InputProps
  menuTextStyleProps?: InputProps
  inputLabelStyleProps?: BoxProps


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

  /* States */
  const [isCreating, setIsCreating] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [inputItems, setInputItems] = React.useState<T[]>(items)

  /* Refs */
  const disclosureRef = React.useRef(null)

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


  return (
    <ThemeProvider>
      <FormLabel {...getLabelProps({})}>
        Choose some fruits:
      </FormLabel>
      <div>
        <div>
          {selectedItems.map((selectedItem, index) => (
            <Box as="span"
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem.label}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
                type='button'
                aria-label='Remove small badge'
              >
                &#10005;
              </Button>
            </Box>
          ))}
        </div>
        <div {...getComboboxProps()}>
          <Input
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
            <Button {...getToggleButtonProps()} aria-label='toggle menu'> &#8595; </Button>
          </div>
        </div>
        <Box as="ul"
          {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={{
                  backgroundColor: 'red',
                  fontWeight: 'bold'

                }}
                className={cc({
                  'p-2 text-sm bg-white border-b': true,
                  'bg-gray-100':
                    highlightedIndex === index
                })}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {isCreating ? (
                  <Text>
                    <Box as="span">Create</Box>{' '}
                    <Box as="span">
                      {item.label}
                    </Box>
                  </Text>
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
                      />
                    </div>
                  )}
              </li>
            ))}
        </Box>
      </div>
    </ThemeProvider>
  )
}
