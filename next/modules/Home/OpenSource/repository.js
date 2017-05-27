import React from 'react'
import glamorous, {Div} from 'glamorous'
import Colors from '../../../constants/colors'
import {H1, A, Span} from '../../../components/Text'
import {Container, Row, Column, Horizontal} from '../../../components/Layout'
import {Circle} from '../../../components/Shapes'
import {FaBars, FaStar, FaCodeFork} from 'react-icons/lib/fa'
import {GoRepoForked} from 'react-icons/lib/go'

export default function Repository({name, description, url, stars, forks, ...rest}) {
  var starCount = stars > 1000 ? `${stars / 1000}k` : stars;
  return (
    <ProjectCard {...rest}>
      <Horizontal>
        <Bars />
        <ProjectLink href="#">{name}</ProjectLink>
      </Horizontal>

      <ProjectDescription ellipsis>{description}</ProjectDescription>

      <Horizontal>
        <ProjectMeta>
          <Circle
            color="#f1e05a"
            size={12}
            marginRight={5}
          />
          Javascript
        </ProjectMeta>

        <ProjectMeta>
          <Star
            color={Colors.Gray.NORMAL}
            fontSize={14}
          />
          {starCount}
        </ProjectMeta>

        <ProjectMeta>
          <Fork
            color={Colors.Gray.NORMAL}
            fontSize={14}
          />
          {forks}
        </ProjectMeta>
      </Horizontal>
    </ProjectCard>
  )
}

const ProjectCard = glamorous.view({
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#e1e4e8',
  borderRadius: 3,
  padding: 16,
  flex: 1,

  '@media (max-width: 1200px)': {
    marginRight: '0px !important',
    width: '100%',
    marginBottom: 10
  }
}, props => ({
  marginRight: props.last ? 0 : 10
}))

const Bars = glamorous(FaBars)({
  fontSize: 12,
  color: Colors.Gray.NORMAL,
  marginRight: 5
})

const Star = glamorous(FaStar)({
  color: Colors.Gray.NORMAL,
  fontSize: 14,
  marginRight: 3
})

const Fork = glamorous(GoRepoForked)({
  color: Colors.Gray.NORMAL,
  fontSize: 14,
  marginRight: 3
})

const ProjectLink = glamorous(A)({
  fontSize: 16
})

const ProjectDescription = glamorous.p({
  marginTop: 10,
  marginBottom: 12,
  fontSize: 12
})

const ProjectMeta = glamorous(Horizontal)({
  marginRight: 10,
  fontSize: 12
})
