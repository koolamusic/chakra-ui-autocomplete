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
import { FormLabel, FormLabelProps } from '@chakra-ui/form-control'
import { Text, Stack, Box, BoxProps, List, ListItem, ListIcon } from '@chakra-ui/layout'
import { Button, ButtonProps } from '@chakra-ui/button'
import { Input, InputProps } from '@chakra-ui/input'
import { IconProps, CheckCircleIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { Tag, TagCloseButton, TagLabel, TagProps } from '@chakra-ui/tag'
import { ComponentWithAs } from '@chakra-ui/react'

export interface Item {
  label: string
  value: string
}

export interface CUIMultipleAutoCompleteProps<T extends Item>
  extends UseMultipleSelectionProps<T> {
  items: T[]
  placeholder: string
  label: string
  highlightItemBg?: string
  onCreateItem?: (item: T) => void
  optionFilterFunc?: (items: T[], inputValue: string) => T[]
  itemRenderer?: (item: T) => string | JSX.Element
  labelStyleProps?: FormLabelProps
  inputStyleProps?: InputProps
  toggleButtonStyleProps?: ButtonProps
  tagStyleProps?: TagProps
  listStyleProps?: BoxProps
  listItemStyleProps?: BoxProps
  emptyState?: (inputValue: string) => React.ReactNode
  selectedIconProps?: Omit<IconProps, 'name'> & {
    icon: IconProps['name'] | React.ComponentType
  }
  icon?: ComponentWithAs<"svg", IconProps>
  hideToggleButton?: boolean
}

function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] })
}

export const CUIMultipleAutoComplete = <T extends Item>(
  props: CUIMultipleAutoCompleteProps<T>
): React.ReactElement<CUIMultipleAutoCompleteProps<T>> => {
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
                  <Text>
                    <Box as='span'>Create</Box>{' '}
                    <Box as='span' bg='yellow.300' fontWeight='bold'>
                      "{item.label}"
                    </Box>
                  </Text>
                ) : (
                    <Box display='inline-flex' alignItems='center'>
                      {selectedItemValues.includes(item.value) && (
                        <ListIcon
                          as={icon || CheckCircleIcon}
                          color='green.500'
                          role='img'
                          display='inline'
                          aria-label='Selected'
                          {...selectedIconProps}
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
