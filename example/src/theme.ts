import { theme as chakraTheme, DefaultTheme } from '@chakra-ui/core';

const fonts = {
	...chakraTheme.fonts,
	mono: `'Menlo', Monaco, Fira Code, Ubuntu Mono, monospace`,
	heading: `"Graphik Web", 'Inter', 'Ubuntu', Cantarell, Oxygen, sans-serif`,
	body: `"Graphik Web", 'Inter', 'Ubuntu', Segoe UI, Cantarell, Oxygen, Roboto, Fira Sans, Helvetica Neue, sans-serif`
};
const fontSizes = {
	xs: '0.65rem',
	sm: '0.875rem',
	md: '1rem',
	lg: '1.125rem',
	xl: '1.25rem',
	'2xl': '1.5rem',
	'3xl': '1.875rem',
	'4xl': '2.25rem',
	'5xl': '3rem',
	'6xl': '4rem'
};

const colors = {
	...chakraTheme.colors,
	black: '#40474e',
	default: '#1fdc6b',
	tomato: 'FF5238',
	text: '#1D1D1D',
	background: '#F7FAFC',
	altBackground: '#fafffd'
};
const breakpoints = [ '40em', '52em', '64em' ];

const theme: DefaultTheme = {
	...chakraTheme,
	colors,
	fonts,
	fontSizes,
	breakpoints,
	icons: {
		...chakraTheme.icons
	}
};

export default theme;
