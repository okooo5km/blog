import { type IconProps } from '~/assets'

export function CometIcon(props: IconProps = {}) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 4L11 11M9 4L12.5 7.5M4 9L7.5 12.5M15.5 18.5L12.5 20L13 16.5L11 14.5L14 14L15.5 11L17 14L20 14.5L18 16.5L18.5 20L15.5 18.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
