import FooterWrapper from './footer-wrapper'
import InjectionMonth from './injection-month'
import TimeSlider from './time-slider'

const Footer = () => {
  return (
    <>
      <FooterWrapper bottom={[56, 56, 0, 0]}>
        <InjectionMonth />
      </FooterWrapper>
      <FooterWrapper>
        <TimeSlider />
      </FooterWrapper>
    </>
  )
}

export default Footer
