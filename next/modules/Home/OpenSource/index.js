import React from 'react'
import Colors from '../../../constants/colors'
import {H1, H2, A} from '../../../components/Text'
import {Container, Row, Column, Horizontal} from '../../../components/Layout'
import {Circle} from '../../../components/Shapes'
import Section from '../section'
import Title from '../title'
import glamorous, {Div, Span} from 'glamorous'
import Repository from './repository'
import {Commit, PullRequest} from './activity'

const isClient = typeof window !== 'undefined'

export default () => (
  <Div>
    <Section>
      <Title>Open Source</Title>

      <Row>
        <Column width="60%">
          <H2>Project Involvement</H2>
          <ProjectRow>
            <Repository
              name="robinpowered/glamorous-native"
              description="ReactNative component styling solved 💄"
              url="https://github.com/paypal/glamorous"
              stars={94}
              forks={7}
            />
            <Repository
              name="paypal/glamorous"
              description="React component styling solved 💄"
              url="https://github.com/paypal/glamorous"
              stars={1600}
              forks={111}
              last
            />
          </ProjectRow>

          <ProjectRow>
            <Repository
              name="ajwhite/MagicMirror"
              description="🔮 ReactNative smart mirror project"
              url="https://github.com/paypal/glamorous"
              stars={212}
              forks={21}
            />
            <Repository
              name="ajwhite/render-if"
              description="⚛ Lightweight React control flow rendering"
              url="https://github.com/ajwhite/render-if"
              stars={100}
              forks={6}
              last
            />
          </ProjectRow>

          <ProjectRow>
            <Repository
              name="ajwhite/gulp-ng-config"
              description="🔧 Create AngularJS constants from a JSON config file"
              url="https://github.com/ajwhite/gulp-ng-config"
              stars={160}
              forks={35}
            />
            <Repository
              name="ajwhite/angular-translate-once"
              description="💱 Extension of angular-translate for one time bindings"
              url="https://github.com/ajwhite/angular-translate-once"
              stars={47}
              forks={12}
              last
            />
          </ProjectRow>
        </Column>

        <Column>
          <H2>Recent Activity</H2>

          <Commit project="robinpowered/glamorous-native" />
          <Commit project="robinpowered/glamorous-native" />
          <PullRequest project="wix/react-native-calendars" />
          <Commit project="ajwhite/render-if" />
          <PullRequest project="robinpowered/glamorous-native" />
          <PullRequest project="paypal/glamorous" />
        </Column>
      </Row>


    </Section>
  </Div>
)

const ProjectRow = glamorous.view({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,

  '@media (max-width: 1200px)': {
    flexDirection: 'column',
    marginBottom: 0
  },
  // // tablet
  // '@media (min-width: 768px)': {
  //   flexDirection: 'column',
  //   marginBottom: 0
  // },
})
