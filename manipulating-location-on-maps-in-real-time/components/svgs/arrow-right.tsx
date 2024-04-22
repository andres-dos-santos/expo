import Svg, { Circle, Path } from 'react-native-svg'

export function ArrowRightSvg() {
  return (
    <Svg viewBox="0 0 24 24" width="18" height="18" color="#FFF" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
      <Path
        d="M10.5 8C10.5 8 13.5 10.946 13.5 12C13.5 13.0541 10.5 16 10.5 16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  )
}
