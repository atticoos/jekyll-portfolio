import React from 'react'
import glamorous, {Div, Span} from 'glamorous'
import Colors from '../../../constants/colors'
import {A} from '../../../components/Text'
import {Horizontal} from '../../../components/Layout'
import {GoGitCommit, GoGitPullRequest} from 'react-icons/lib/go'

export function Commit ({project}) {
  return (
    <Container>
      <IconContainer>
        <GoGitCommit />
      </IconContainer>
      <Div>
        <Message>
          pushed <A href="#">one commit</A> to <A href="#">{project}</A>
        </Message>
        <Time>
          a day ago
        </Time>
      </Div>
    </Container>
  )
}

export function PullRequest ({project}) {
  return (
    <Container>
      <IconContainer>
        <GoGitPullRequest />
      </IconContainer>
      <Div>
        <Message>
          opened a <A href="#">pull request</A> on <A href="#">{project}</A>
        </Message>
        <Time>
          a day ago
        </Time>
      </Div>
    </Container>
  )
}

const Container = glamorous(Horizontal)({
  marginTop: 10,
  marginBottom: 10
})

const IconContainer = glamorous.div({
  // width: 30,
  // backgroundColor: 'red',
  marginRight: 10,
  color: Colors.Gray.NORMAL,
  fontSize: 20
})

const CommitIcon = glamorous(GoGitCommit)({
  fontSize: 18,
})

const PullRequestIcon = glamorous(GoGitPullRequest)({
  fontSize: 18
})

const Message = glamorous.div({
  fontSize: 14,
  marginBottom: 5
})

const Time = glamorous.div({
  fontSize: 12
})
