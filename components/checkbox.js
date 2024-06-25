import { Checkbox as ThemedCheckbox, Label } from 'theme-ui'

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <Label
      sx={{
        cursor: 'pointer',
        textTransform: 'uppercase',
        color: 'secondary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        fontSize: [1, 1, 1, 2],
      }}
    >
      <ThemedCheckbox
        checked={checked}
        onChange={onChange}
        sx={{
          width: [16, 16, 16, 18],
          mr: 1,
          mt: ['-3px', '-3px', '-3px', '-1px'],
          color: 'secondary',
          transition: 'color 0.15s',
          'input:active ~ &': {
            bg: 'background',
            color: 'primary',
          },
          'input:focus ~ &': {
            bg: 'background',
            color: checked ? 'primary' : 'muted',
          },
          'input:hover ~ &': {
            bg: 'background',
            color: 'primary',
          },
          'input:focus-visible ~ &': {
            outline: 'dashed 1px rgb(110, 110, 110, 0.625)',
            background: 'rgb(110, 110, 110, 0.625)',
          },
        }}
      />
      {label}
    </Label>
  )
}

export default Checkbox
