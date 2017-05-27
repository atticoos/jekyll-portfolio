import React from 'react'
import Colors from '../../../constants/colors'
import {H1, H2, P, A} from '../../../components/Text'
import {Container, Row, Column} from '../../../components/Layout'
import Title from '../title'
import ColorfulBand from '../../../components/colorfulBand'
import glamorous, {Img, Div} from 'glamorous'

const SectionRow = glamorous(Row)({
  marginBottom: 100
})

const Separator = () => (
  <ColorfulBand
    count={6}
    width={600}
    marginLeft="auto"
    marginRight="auto"
    type="dots"
    opacity={0.75}
    marginTop={100}
    marginBottom={160}
  />
)

export default () => (
  <Container paddingTop={80}>
    <Title>Featured Work</Title>


    <ProjectSection
      title="Robin Rooms"
      subtitle="Room schedules, right at your door"
      image="https://robinpowered.com/img/screens/ipad-unbooked-checkin-small.png"
      blurb="I build the iPad and Android tablet applications. Robin customers mount these tablets outside of their conference rooms as interactive digital signage indicating the current status and daily schedule for the room. Coworkers can start new meetings or check into existing meetings on their way into the room. If the room is busy, they can also find another space from the tablet."
      projectUrl="https://robinpowered.com/features/room-display"
      odd
    />


    <Separator />

    <ProjectSection
      title="Robin Compass"
      subtitle="Your office schedule, right in your pocket"
      image="https://robinpowered.com/img/screens/iphone-user-schedule.png"
      blurb="I build the iPad and Android tablet applications. Robin customers mount these tablets outside of their conference rooms as interactive digital signage indicating the current status and daily schedule for the room. Coworkers can start new meetings or check into existing meetings on their way into the room. If the room is busy, they can also find another space from the tablet."
      projectUrl="https://robinpowered.com/features/mobile"
    />

    <Separator />

    <ProjectSection
      title="Bernie Messenger"
      subtitle="Lorem Ipsum"
      image="https://atticuswhite.com/dist/images/projects/bernie-messenger/device-messenger.png"
      blurb={`Bernie Messenger helps users communicate official calls to action from the Bernie 2016 campaign to their personal contacts. I built this mobile application with React Native and Redux and manage its distribution.`}
      projectUrl="https://go.berniesanders.com/page/content/bernie-messenger"
      odd
    />

    <Separator />

    <ProjectSection
      title="TweetDrive"
      subtitle="A game played during the 2011 NFL Playoffs on NBCSports"
      image="https://atticuswhite.com/dist/images/projects/tweetdrive/tweetdrive1.jpg"
      blurb={`TweetDrive was a trivia game hosted on NBCSports.com during the 2011 NFL playoffs. I built the web application that allows users to engage in the game through either twitter or the web application itself. A series of questions are posted every quarter of the game and users can response with their predictions - "How many yards will Brady throw in the first quarter". The speed in which a user responds along with the accuracy of their prediction awards them pointage in terms of yards (out of 100). Every 100 yards is a touchdown. The players with the highest touchdowns (total yards) wins.`}
    />


  <ColorfulBand
    count={12}
    width={'80%'}
    marginLeft="auto"
    marginRight="auto"
    type="dashes"
    opacity={0.75}
    marginTop={150}
    marginBottom={150}
  />
  </Container>
)



function ProjectSection ({title, subtitle, image, blurb, projectUrl, odd}) {
  const infoColumn = (
    <Column>
      <H1 marginTop={20}>{title}</H1>
      <H2 marginBottom={0} marginTop={0}>{subtitle}</H2>
      {!!blurb && <P>{blurb}</P>}
      {!!projectUrl &&
        <A href={projectUrl} marginTop={20} newWindow>View Project</A>
      }
    </Column>
  )

  const imageColumn = (
    <Column>
      <Img
        src={image}
        display="block"
        width="auto"
        height="auto"
        maxWidth="100%"
        maxHeight="500px"
        objectFit="contain"
      />
    </Column>
  )

  return (
    <SectionRow>
      {odd ? imageColumn : infoColumn}
      {odd ? infoColumn : imageColumn}
    </SectionRow>
  )
}
