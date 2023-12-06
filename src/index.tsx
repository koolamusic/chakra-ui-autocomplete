import React, { useRef, useState, useEffect } from 'react';
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from 'downshift';
import { matchSorter } from 'match-sorter';
import Highlighter from 'react-highlight-words/index';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';
import {
  FormLabel,
  Text,
  Stack,
  Box,
  List,
  ListItem,
  ListIcon,
  Button,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  ResponsiveValue,
  useColorMode,
  BoxProps,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowDownIcon, IconProps } from '@chakra-ui/icons';

/**
 * Interface for each item in the autocomplete dropdown.
 */
export interface Item {
  label: string;
  value: string;
}

/**
 * Props for the CUIAutoComplete component.
 *
 * @template T - The type of items in the autocomplete dropdown.
 * @extends UseMultipleSelectionProps<T> - Props from the useMultipleSelection hook.
 *
 * @property {T[]} items - An array of items for the autocomplete dropdown.
 * @property {string} placeholder - The placeholder text for the input field.
 * @property {string} label - The label for the autocomplete component.
 * @property {string} [highlightItemBg] - Background color for the highlighted item in the dropdown.
 * @property {(item: T) => void} [onCreateItem] - Callback function when a new item is created.
 * @property {(items: T[], inputValue: string) => T[]} [optionFilterFunc] - Function to filter items based on input value.
 * @property {(item: T) => string | JSX.Element} [itemRenderer] - Custom renderer for each item in the dropdown.
 * @property {any} [labelStyleProps] - Additional style props for the label element.
 * @property {any} [inputStyleProps] - Additional style props for the input element.
 * @property {any} [toggleButtonStyleProps] - Additional style props for the toggle button (dropdown button).
 * @property {any} [tagStyleProps] - Additional style props for the selected tags.
 * @property {any} [listStyleProps] - Additional style props for the list (dropdown menu).
 * @property {() => any} [onClearAll] - Callback function when the "Clear All" button is clicked.
 * @property {any} [listItemStyleProps] - Additional style props for each item in the dropdown menu.
 * @property {(inputValue: string) => React.ReactNode} [emptyState] - Custom content to display when no items match the input.
 * @property {Omit<IconProps, 'name'> & { icon: IconProps['name'] | React.ComponentType }} [selectedIconProps] - Props for the icon indicating a selected item.
 * @property {React.ComponentType<IconProps>} [icon] - Custom icon component for the selected items.
 * @property {boolean} [hideToggleButton] - Whether to hide the toggle button (dropdown button).
 * @property {(value: string) => string | JSX.Element} [createItemRenderer] - Custom renderer for creating a new item.
 * @property {boolean} [disableCreateItem] - Whether to disable the creation of new items.
 * @property {(inputProps: any, toggleButtonProps: any) => JSX.Element} [renderCustomInput] - Custom renderer for the input field and toggle button.
 */
export interface CUIAutoCompleteProps<T extends Item>
  extends UseMultipleSelectionProps<T> {
  /**
   * An array of items for the autocomplete dropdown.
   *
   * @type {T[]}
   */
  items: T[];

  /**
   * Should the clear all button be enabled
   *
   * @type {boolean}
   * @default false
   */
  clearAll?: boolean;

  /**
   * Should Keyboard shortcuts be enabled
   *
   * @type {boolean}
   * @default true
   */
  keyboardShortcuts?: boolean;

  /**
   * The placeholder text for the input field.
   *
   * @type {string}
   */
  placeholder: string;

  /**
   * The label for the autocomplete component.
   *
   * @type {string}
   */
  label: string;

  /**
   * Background color for the highlighted item in the dropdown.
   *
   * @type {string|undefined}
   */
  highlightItemBg?: string;

  /**
   * Callback function when a new item is created.
   *
   * @type {(item: T) => void|undefined}
   */
  onCreateItem?: (item: T) => void;

  /**
   * Function to filter items based on the input value.
   *
   * @type {(items: T[], inputValue: string) => T[]|undefined}
   */
  optionFilterFunc?: (items: T[], inputValue: string) => T[];

  /**
   * Custom renderer for each item in the dropdown.
   *
   * @type {(item: T) => string | JSX.Element|undefined}
   */
  itemRenderer?: (item: T) => string | JSX.Element;

  /**
   * Additional style props for the label element.
   *
   * @type {React.HTMLAttributes<HTMLLabelElement>|undefined}
   */
  labelStyleProps?: React.HTMLAttributes<HTMLLabelElement>;

  /**
   * Additional style props for the input element.
   *
   * @type {React.InputHTMLAttributes<HTMLInputElement> & { size?: ResponsiveValue<string> } | undefined}
   */
  inputStyleProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    size?: ResponsiveValue<string>;
  };

  /**
   * Additional style props for the toggle button (dropdown button).
   *
   * @type {React.ButtonHTMLAttributes<HTMLButtonElement>|undefined}
   */
  toggleButtonStyleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Additional style props for the selected tags.
   *
   * @type {React.HTMLAttributes<HTMLDivElement>|undefined|BoxProps}
   */
  tagStyleProps?: React.HTMLAttributes<HTMLDivElement> | BoxProps;

  /**
   * Additional style props for the list (dropdown menu).
   *
   * @type {React.HTMLAttributes<HTMLUListElement>|undefined}
   */
  listStyleProps?: React.HTMLAttributes<HTMLUListElement>;

  /**
   * Callback function when the "Clear All" button is clicked.
   *
   * @type {() => any|undefined}
   */
  onClearAll?: () => any;

  /**
   * Additional style props for each item in the dropdown menu.
   *
   * @type {React.HTMLAttributes<HTMLLIElement>|undefined}
   */
  listItemStyleProps?: React.HTMLAttributes<HTMLLIElement>;

  /**
   * Custom content to display when no items match the input.
   *
   * @type {(inputValue: string) => React.ReactNode|undefined}
   */
  emptyState?: (inputValue: string) => React.ReactNode;

  /**
   * Props for the icon indicating a selected item.
   *
   * @type {Omit<IconProps, 'name'> & { icon: IconProps['name'] | React.ComponentType }|undefined}
   */
  selectedIconProps?: Omit<IconProps, 'name'> & {
    icon: IconProps['name'] | React.ComponentType;
  };

  /**
   * Custom icon component for the selected items.
   *
   * @type {React.ComponentType<IconProps>|undefined}
   */
  icon?: React.ComponentType<IconProps>;

  /**
   * Whether to hide the toggle button (dropdown button).
   *
   * @type {boolean|undefined}
   */
  hideToggleButton?: boolean;

  /**
   * Custom renderer for creating a new item.
   *
   * @type {(value: string) => string | JSX.Element|undefined}
   */
  createItemRenderer?: (value: string) => string | JSX.Element;

  /**
   * Whether to disable the creation of new items.
   *
   * @type {boolean|undefined}
   */
  disableCreateItem?: boolean;

  /**
   * Custom renderer for the input field and toggle button.
   *
   * @type {(inputProps: React.InputHTMLAttributes<HTMLInputElement>, toggleButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>) => JSX.Element|undefined}
   */
  renderCustomInput?: (
    inputProps: React.InputHTMLAttributes<HTMLInputElement>,
    toggleButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>
  ) => JSX.Element;
}

/**
 * Default option filter function to match and sort items based on label and value.
 */
function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] });
}

/**
 * Default renderer for creating a new item.
 */
function defaultCreateItemRenderer(value: string) {
  return (
    <Text>
      <Box as="span">Create</Box>{' '}
      <Box as="span" bg="yellow.300" fontWeight="bold">
        &quot;{value}&quot;
      </Box>
    </Text>
  );
}

/**
 * Chakra UI Autocomplete Component.
 *
 * @component
 * @example
 * // Basic usage
 * <CUIAutoComplete
 *   items={[]}
 *   placeholder="Search..."
 *   hideToggleButton={true} // Hide the dropdown button
 *   label="Select or Create Items"
 *   onCreateItem={(item) => console.log('Created:', item)}
 *   onClearAll={() => console.log('Cleared all items')}
 *   clearAll={true} // Enable the clear all button
 * />
 *
 * @param {CUIAutoCompleteProps} props - Component properties.
 * @returns {React.ReactElement} - Autocomplete component.
 */
export const CUIAutoComplete = <T extends Item>(
  props: CUIAutoCompleteProps<T>
): React.ReactElement<CUIAutoCompleteProps<T>> => {
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
    onClearAll,
    clearAll = false,
    keyboardShortcuts = true,
    onCreateItem,
    icon: CustomIcon,
    hideToggleButton = false,
    disableCreateItem = false,
    createItemRenderer = defaultCreateItemRenderer,
    renderCustomInput,
    ...downshiftProps
  } = props;

  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputItems, setInputItems] = useState<T[]>(items);
  const [error, setError] = useState('');

  const disclosureRef = useRef(null);

  const { colorMode } = useColorMode(); // Check the color mode for the CUI instance (light or dark)
  const borderColor = colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.300';

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection(downshiftProps);
  const selectedItemValues = selectedItems.map((item) => item.value);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    selectItem,
    setHighlightedIndex,
  } = useCombobox({
    inputValue,
    selectedItem: undefined,
    items: inputItems,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      const filteredItems = optionFilterFunc(items, inputValue || '');

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false);
      }

      if (!selectedItem) {
        setInputItems(filteredItems);
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: false,
          };
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue,
            isOpen: true,
          };
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            inputValue,
          };
        default:
          return changes;
      }
    },
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || '');
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            // Validate input value
            if (selectedItemValues.includes(selectedItem.value)) {
              setError('Item already selected.');
            } else {
              setError('');
            }

            if (selectedItemValues.includes(selectedItem.value)) {
              removeSelectedItem(selectedItem);
            } else {
              if (onCreateItem && isCreating) {
                onCreateItem(selectedItem);
                setIsCreating(false);
                setInputItems(items);
                setInputValue('');
              } else {
                addSelectedItem(selectedItem);
              }
            }

            selectItem(null);
          }
          break;
        default:
          break;
      }
    },
  });

  const clearSelection = () => {
    setInputValue('');
    setInputItems(items);
    setHighlightedIndex(0);
    selectItem(null);
    onClearAll && onClearAll();
  };

  useEffect(() => {
    if (inputItems.length === 0 && !disableCreateItem) {
      setIsCreating(true);
      setInputItems([{ label: `${inputValue}`, value: inputValue }] as T[]);
      setHighlightedIndex(0);
    }
  }, [
    inputItems,
    setIsCreating,
    setHighlightedIndex,
    inputValue,
    disableCreateItem,
  ]);

  useDeepCompareEffect(() => {
    setInputItems(items);
  }, [items]);

  function defaultItemRenderer(selected: T) {
    return selected.label;
  }

  const handleKeyDown = (e: { key: string }) => {
    if (keyboardShortcuts === false) return;

    if (e.key === 'Escape') {
      // Handle escape key (e.g., close dropdown)
      if (isOpen) {
        // Close the dropdown
        setInputValue('');
        setIsCreating(false);
      }
    } else if (e.key === 'Enter') {
      // Handle enter key (e.g., select highlighted item or create new item)
      if (highlightedIndex !== null) {
        const selectedItem = inputItems[highlightedIndex];
        if (selectedItem) {
          if (selectedItemValues.includes(selectedItem.value)) {
            removeSelectedItem(selectedItem);
          } else {
            if (onCreateItem && isCreating) {
              onCreateItem(selectedItem);
              setIsCreating(false);
              setInputItems(items);
              setInputValue('');
            } else {
              addSelectedItem(selectedItem);
            }
          }
        }
      } else if (isCreating) {
        // Create a new item with the current input value
        const newItem = { label: inputValue, value: inputValue } as T;
        if (onCreateItem) {
          onCreateItem(newItem);
          setInputValue('');
        }
      }
    } else if (e.key === 'ArrowDown') {
      // Handle arrow down key (e.g., navigate to the next item)
      //@ts-ignore
      setHighlightedIndex((prevIndex: number | null) =>
        prevIndex === null || prevIndex === inputItems.length - 1
          ? 0
          : ((prevIndex + 1) as number)
      );
    } else if (e.key === 'ArrowUp') {
      // Handle arrow up key (e.g., navigate to the previous item)
      //@ts-ignore
      setHighlightedIndex((prevIndex: number | null) =>
        prevIndex === null || prevIndex === 0
          ? ((inputItems.length - 1) as number)
          : prevIndex - 1
      );
    } else if (e.key === 'Tab') {
      // Handle tab key (e.g., close dropdown if no item is highlighted)
      if (isOpen && highlightedIndex === null) {
        // Close the dropdown
        setInputValue('');
        setIsCreating(false);
      }
    }
  };

  return (
    <Stack>
      {/* Label */}
      <FormLabel {...getLabelProps({ ...labelStyleProps })}>{label}</FormLabel>

      {/* Selected Tags */}
      {selectedItems && (
        <Stack spacing={2} isInline flexWrap="wrap">
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
                  e.stopPropagation();
                  removeSelectedItem(selectedItem);
                }}
                aria-label="Remove menu selection badge"
              />
            </Tag>
          ))}
        </Stack>
      )}

      {/* @ts-ignore - Input */}
      <Stack {...getInputProps({ onFocus: () => openMenu() })}>
        {renderCustomInput ? (
          renderCustomInput(
            {
              ...inputStyleProps,
              ...getInputProps(
                getDropdownProps({
                  placeholder,
                  onClick: isOpen ? () => {} : openMenu,
                  onFocus: isOpen ? () => {} : openMenu,
                  ref: disclosureRef,
                })
              ),
            },
            {
              ...toggleButtonStyleProps,
              ...getToggleButtonProps(),
              'aria-label': 'toggle menu',
            }
          )
        ) : (
          <>
            <Input
              {...inputStyleProps}
              {...getInputProps(
                getDropdownProps({
                  placeholder,
                  onClick: isOpen ? () => {} : openMenu,
                  onFocus: isOpen ? () => {} : openMenu,
                  onKeyDown: handleKeyDown, // Attach the keyboard shortcut handler
                  ref: disclosureRef,
                })
              )}
            />
            {!hideToggleButton && (
              <Button
                {...toggleButtonStyleProps}
                {...getToggleButtonProps()}
                aria-label="toggle menu"
              >
                <ArrowDownIcon />
              </Button>
            )}
          </>
        )}
      </Stack>

      {/* Clear All Button */}
      {clearAll && selectedItems.length > 0 && (
        <Button onClick={clearSelection} variant="link" color="blue.500">
          Clear All
        </Button>
      )}

      {error && <Text color="red.500">{error}</Text>}

      {/* Menu Lists Component */}
      <Box pb={4} mb={4}>
        <List
          bg="white"
          borderRadius="4px"
          // @ts-ignore
          border={isOpen && '1px solid rgba(0,0,0,0.1)'}
          borderColor={borderColor}
          boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
          {...listStyleProps}
          {...getMenuProps()}
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <ListItem
                px={2}
                py={1}
                borderBottom="1px solid rgba(0,0,0,0.01)"
                _hover={{ bg: 'grey.900' }}
                bg={highlightedIndex === index ? highlightItemBg : 'inherit'}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {isCreating ? (
                  createItemRenderer(item.label)
                ) : (
                  <Box display="inline-flex" alignItems="center">
                    {selectedItemValues.includes(item.value) && (
                      <ListIcon
                        as={CustomIcon || CheckCircleIcon}
                        color="green.500"
                        role="img"
                        display="inline"
                        aria-label="Selected"
                        {...selectedIconProps}
                      />
                    )}

                    {itemRenderer ? (
                      itemRenderer(item)
                    ) : (
                      //@ts-expect-error This is a valid package but showing its not.
                      <Highlighter
                        autoEscape={true}
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
    </Stack>
  );
};