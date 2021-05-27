/* eslint-disable prettier/prettier */
import * as React from 'react'
import {
  useCombobox,
  UseComboboxProps,
} from 'downshift'
import matchSorter from 'match-sorter'
import Highlighter from 'react-highlight-words'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { FormLabel } from '@chakra-ui/form-control'
import { Stack, Box, List, ListItem, ListIcon } from '@chakra-ui/layout'
import { CreateItem } from './CreateItem'
import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { CheckCircleIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { FormControl } from '@chakra-ui/react'
import { Item } from './types/Item'
import { AutocompleteBaseProps } from './types/AutoCompleteBaseProps'

function defaultCreateItemRenderer(value: string) {
  return (
    <CreateItem value={value} />
  )
}

export type CUIAutocompleteProps<T extends Item> = UseComboboxProps<T> & AutocompleteBaseProps<T>

function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] })
}

export const CUIAutocomplete = <T extends Item>(
  props: CUIAutocompleteProps<T>
): React.ReactElement<CUIAutocompleteProps<T>> => {
  const itemToString = (item?: T | null) => (item ? item.label : '')
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
  // const disclosureRef = React.useRef(null)

  /* Downshift Props */
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
    selectedItem,
    // selectItem,
    setHighlightedIndex,
  } = useCombobox({
    ...downshiftProps,
    itemToString,
    inputValue,
    items: inputItems,
    onInputValueChange: async ({ inputValue }) => {      
      setInputValue(inputValue || '')
      const filteredItems = await optionFilterFunc(items, inputValue || '')

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false)
      }

      setInputItems(filteredItems)
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            ...((changes.selectedItem && changes.selectedItem.label) ? {
              inputValue: changes.selectedItem.value === '' ? '' : changes.selectedItem.label,
            } : {}),
            isOpen: false
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
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || '')
          break
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem)  {
            if (onCreateItem && isCreating) {
              onCreateItem(selectedItem)
              setIsCreating(false)
              setInputItems(items)
              setInputValue(selectedItem.label)
              }
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
  }, [inputItems, setIsCreating, setHighlightedIndex, inputValue, disableCreateItem])

  useDeepCompareEffect(() => {
    setInputItems(items)
  }, [items])

  /* Default Items Renderer */
  function defaultItemRenderer<T extends Item>(selected: T) {
    return selected.label
  }

  return (
    <FormControl as={Stack}>
      <FormLabel {...{ ...getLabelProps({}), ...labelStyleProps }}>{label}</FormLabel>
      {/* -----------Section that renders the input element ----------------- */}
      <Stack isInline {...getComboboxProps()}>
        <Input
          {...inputStyleProps}
          {...getInputProps({
            onClick: isOpen ? () => { } : openMenu,
            onFocus: isOpen ? () => { } : openMenu,
          })}
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
                    {selectedItem?.value === item.value && (
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
    </FormControl>
  )
}
