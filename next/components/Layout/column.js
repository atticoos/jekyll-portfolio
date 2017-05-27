import glamorous from 'glamorous'

const Column = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,

    '@media (max-width: 767px)': {
      width: '100% !important'
    }
  },
  (props) => {
    if (props.twoThirds) {
      return {
        flex: 'none',
        width: '66%'
      };
    }
    return null;
  },
  (props) => {
    if (props.width) {
      return {
        flex: 'none',
        width: props.width
      }
    }
    return null
  }
)
Column.propsAreCssOverrides = true

export default Column
