import { BoxProps, ButtonProps, ComponentWithAs, FormLabelProps, IconProps, InputProps } from "@chakra-ui/react";
import { Item } from "./Item";

export interface AutocompleteBaseProps<T extends Item> {
  /** 
  * An array of the items to be selected within the input field
  */
  items: T[]
  /**
  * The placeholder for the input field
  */
  placeholder: string
  /**
  * Input Form Label to describe the activity or process
  */
  label: string
  /**
  * 	For accessibility, you can define a custom color for the highlight color when user is typing also accept props like yellow.300 based on chakra theme provider
  */
  highlightItemBg?: string
  /**
  * Function to handle creating new Item
  */
  onCreateItem?: (item: T) => void
  /**
  * You can define a custom Function to handle filter logic
  */
  optionFilterFunc?: ((items: T[], inputValue: string) => T[]) | ((items: T[], inputValue: string) => Promise<T[]>)
  /**
  * 	Custom Function that can either return a JSX Element or String, in order to control how the list items within the Dropdown is rendered
  */
  itemRenderer?: (item: T) => string | JSX.Element
  /**
  * Custom style props based on chakra-ui for labels, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  labelStyleProps?: FormLabelProps
  /**
  * Custom style props based on chakra-ui for input field, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  inputStyleProps?: InputProps
  /**
  * Custom style props based on chakra-ui for toggle button, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  toggleButtonStyleProps?: ButtonProps
  /**
  * 	Custom style props based on chakra-ui for dropdown list, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  listStyleProps?: BoxProps
  /**
  * 	Custom style props based on chakra-ui for single list item in dropdown, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  listItemStyleProps?: BoxProps
  /**
  * 	Custom style props based on chakra-ui for the green tick icon in dropdown list, Example `{{ bg: 'gray.100', pt: '4'}}`
  */
  selectedIconProps?: Omit<IconProps, 'name'> & {
    icon: IconProps['name'] | React.ComponentType
  }
  /**
  * 	@chakra-ui/icons Icon to be displayed instead of CheckCircleIcon
  */
  icon?: ComponentWithAs<'svg', IconProps>
  /**
  * 	Hide the toggle button
  */
  hideToggleButton?: boolean
  /**
  * Custom Function that can either return a JSX Element or String, in order to control how the create new item within the Dropdown is rendered. The input value is passed as the first function parameter, Example: `(value) => \`Create ${value}\``
  */
  createItemRenderer?: (value: string) => string | JSX.Element
  /**
  * Disable the "create new" list Item. Default is `false`
  */
  disableCreateItem?: boolean
}