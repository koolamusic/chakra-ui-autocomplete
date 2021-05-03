/* eslint-disable prettier/prettier */
import * as React from 'react'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionProps
} from 'downshift'
import matchSorter from 'match-sorter'
import Highlighter from 'react-highlight-words'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { FormLabel } from '@chakra-ui/form-control'
import { Stack, Box, List, ListItem, ListIcon } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { CheckCircleIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { Tag, TagCloseButton, TagLabel, TagProps } from '@chakra-ui/tag'
import { useMemo } from 'react'
import { Item } from './types/Item'
import { AutocompleteBaseProps } from './types/AutoCompleteBaseProps'
import { CreateItem } from './CreateItem'

function defaultCreateItemRenderer(value: string) {
  return (
    <CreateItem value={value} />
  )
} 

export type CUIMultipleAutocompleteProps<T extends Item> =
  UseMultipleSelectionProps<T> & AutocompleteBaseProps<T> & {
  tagStyleProps?: TagProps
}

function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] })
}

export const CUIMultipleAutocomplete = <T extends Item>(
  props: CUIMultipleAutocompleteProps<T>
): React.ReactElement<CUIMultipleAutocompleteProps<T>> => {
  const {
    items,
    optionFilterFunc = defaultOptionFilterFunc,
    itemRenderer,
    highlightItemBg = 'gray.100',
    placeholder,
    label,
    listStyleProps,
    labelStyleProps,
    inputStyleProps,
    toggleButtonStyleProps,
    tagStyleProps,
    selectedIconProps,
    listItemStyleProps,
    onCreateItem,
    icon,
    hideToggleButton = false,
    disableCreateItem = false,
    createItemRenderer = defaultCreateItemRenderer,
    ...downshiftProps
  } = props

  /* States */
  const [isCreating, setIsCreating] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [inputItems, setInputItems] = React.useState<T[]>(items)

  /* Refs */
  const disclosureRef = React.useRef(null)

  /* Downshift Props */
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems
  } = useMultipleSelection(downshiftProps)
  const selectedItemValues = useMemo<string[]>(() => selectedItems.map((item) => item.value), [selectedItems])

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
    onInputValueChange: async ({ inputValue, selectedItem }) => {
      const filteredItems = await optionFilterFunc(items, inputValue || '')

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
    if (inputItems.length === 0 && !disableCreateItem) {
      setIsCreating(true)
      // @ts-ignore
      setInputItems([{ label: `${inputValue}`, value: inputValue }])
      setHighlightedIndex(0)
    }
  }, [inputItems, setIsCreating, setHighlightedIndex, inputValue])

  useDeepCompareEffect(() => {
    setInputItems(items)
  }, [items])

  /* Default Items Renderer */
  function defaultItemRenderer<T extends Item>(selected: T) {
    return selected.label
  }

  return (
    <Stack>
      <FormLabel {...{...getLabelProps({}), ...labelStyleProps}}>{label}</FormLabel>

      {/* ---------Stack with Selected Menu Tags above the Input Box--------- */}
      {selectedItems && (
        <Stack spacing={2} isInline flexWrap='wrap'>
          {selectedItems.map((selectedItem, index) => (
            <Tag
              mb={1}
              {...tagStyleProps}
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
                aria-label='Remove menu selection badge'
              />
            </Tag>
          ))}
        </Stack>
      )}
      {/* ---------Stack with Selected Menu Tags above the Input Box--------- */}

      {/* -----------Section that renders the input element ----------------- */}
      <Stack isInline {...getComboboxProps()}>
        <Input
          {...inputStyleProps}
          {...getInputProps(
            getDropdownProps({
              placeholder,
              onClick: isOpen ? () => { } : openMenu,
              onFocus: isOpen ? () => { } : openMenu,
              ref: disclosureRef
            })
          )}
        />
        {!hideToggleButton && (
          <Button
            {...toggleButtonStyleProps}
            {...getToggleButtonProps()}
            aria-label='toggle menu'
          >
            <ArrowDownIcon />
          </Button>
        )}
      </Stack>
      {/* -----------Section that renders the input element ----------------- */}

      {/* -----------Section that renders the Menu Lists Component ----------------- */}
      <Box pb={4} mb={4}>
        <List
          bg='white'
          borderRadius='4px'
          border={isOpen && '1px solid rgba(0,0,0,0.1)'}
          boxShadow='6px 5px 8px rgba(0,50,30,0.02)'
          {...listStyleProps}
          {...getMenuProps()}
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <ListItem
                px={2}
                py={1}
                borderBottom='1px solid rgba(0,0,0,0.01)'
                {...listItemStyleProps}
                bg={highlightedIndex === index ? highlightItemBg : 'inherit'}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {isCreating ? (
                  createItemRenderer(item.label)
                ) : (
                    <Box display='inline-flex' alignItems='center'>
                      {selectedItemValues.includes(item.value) && (
                        <ListIcon
                          as={icon || CheckCircleIcon}
                          color='green.500'
                          role='img'
                          display='inline'
                          aria-label='Selected'
                          {...selectedIconProps as any}
                        />
                      )}

                      {itemRenderer ? (
                        itemRenderer(item)
                      ) : (
                          <Highlighter
                            autoEscape
                            searchWords={[inputValue || '']}
                            textToHighlight={defaultItemRenderer(item)}
                          />
                        )}
                    </Box>
                  )}
              </ListItem>
            ))}
        </List>
      </Box>
      {/* ----------- End Section that renders the Menu Lists Component ----------------- */}
    </Stack>
  )
}
