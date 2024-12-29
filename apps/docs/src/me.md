<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/simonihmig.png',
    name: 'Simon Ihmig',
    title: 'Senior Engineer II',
    org: 'CrowdStrike',
    links: [
      { icon: 'github', link: 'https://github.com/simonihmig' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/simon-ihmig/' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/simonihmig.bsky.social' },
      { icon: 'mastodon', link: 'https://fosstodon.org/@simonihmig' },
    ]
  },
]
</script>

# About me

<VPTeamMembers
    :members="members"
  />
