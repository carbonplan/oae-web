import { Box } from 'theme-ui'

const Lock = ({ display, sx }) => {
  return (
    <Box
      className='lock-container'
      sx={{
        position: 'absolute',
        right: 0,
        top: '2px',
        pointerEvents: 'none',
        color: 'secondary',
        opacity: 1,
        transition: 'all 0.2s',
        display: display ? 'inherit' : 'none',
        ...sx,
      }}
    >
      <Box
        as='svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        sx={{ width: [14, 14, 14, 14], height: [14, 14, 14, 16] }}
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M10.5 1C8.01472 1 6 3.01472 6 5.5V8H4V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V8H18V5.5C18 3.01472 15.9853 1 13.5 1H10.5ZM16 8V5.5C16 4.11929 14.8807 3 13.5 3H10.5C9.11929 3 8 4.11929 8 5.5V8H16Z'
        />
      </Box>
    </Box>
  )
}

export default Lock
