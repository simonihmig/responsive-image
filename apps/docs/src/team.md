---
layout: page
---
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
  {
    avatar: 'https://www.github.com/wkillerud.png',
    name: 'William Killerud',
    title: 'Senior Developer',
    org: 'Vend',
    links: [
      { icon: 'github', link: 'https://github.com/wkillerud' },
      { icon: 'mastodon', link: 'https://social.lol/@dub' },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>

  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>
