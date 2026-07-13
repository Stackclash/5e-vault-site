import type { GatsbyNode } from "gatsby"
import { slugify } from "../utils"
import path from "path"

interface SiteQueryResult {
  campaigns: {
    nodes: {
      id: string
      name: string
      slug: string
      world: { name: string } | null
      party: { name: string } | null
    }[]
  }
  npcs: { nodes: { id: string; slug: string }[] }
  locations: { nodes: { id: string; slug: string }[] }
  quests: { nodes: { id: string; slug: string }[] }
  sessions: {
    nodes: {
      id: string
      slug: string
      name: string
      sessionNumber: number | null
    }[]
  }
}

const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter
}) => {
  const { createPage } = actions

  const result = await graphql<SiteQueryResult>(`
    query Data {
      campaigns: allCampaign {
        nodes {
          id
          name
          slug
          world {
            name
          }
          party {
            name
          }
        }
      }
      npcs: allNpc {
        nodes {
          id
          slug
        }
      }
      locations: allLocation {
        nodes {
          id
          slug
        }
      }
      quests: allQuest {
        nodes {
          id
          slug
        }
      }
      sessions: allSession(sort: { sessionNumber: ASC }) {
        nodes {
          id
          slug
          name
          sessionNumber
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild("Error loading content for page generation", result.errors)
    return
  }

  const campaigns = result.data?.campaigns?.nodes ?? []
  const npcs = result.data?.npcs?.nodes ?? []
  const locations = result.data?.locations?.nodes ?? []
  const quests = result.data?.quests?.nodes ?? []
  const sessions = result.data?.sessions?.nodes ?? []

  campaigns.forEach((campaign) => {
    const campaignSlug = slugify(campaign.name)

    if (!campaign.world || !campaign.party) {
      reporter.warn(
        `Campaign "${campaign.name}" is missing ${!campaign.world ? "world" : ""}${!campaign.world && !campaign.party ? " and " : ""}${!campaign.party ? "party" : ""} frontmatter — check the vault note for a typo.`
      )
    }

    createPage({
      path: `/${campaignSlug}`,
      component: path.resolve(`./src/templates/campaign-detail.tsx`),
      context: {
        id: campaign.id,
      }
    })
  })

  npcs.forEach((npc) => {
    createPage({
      path: `/npcs/${npc.slug}`,
      component: path.resolve(`./src/templates/npc-detail.tsx`),
      context: { id: npc.id },
    })
  })

  locations.forEach((location) => {
    createPage({
      path: `/locations/${location.slug}`,
      component: path.resolve(`./src/templates/location-detail.tsx`),
      context: { id: location.id },
    })
  })

  quests.forEach((quest) => {
    createPage({
      path: `/quests/${quest.slug}`,
      component: path.resolve(`./src/templates/quest-detail.tsx`),
      context: { id: quest.id },
    })
  })

  sessions.forEach((session, index) => {
    const prev = index > 0 ? sessions[index - 1] : null
    const next = index < sessions.length - 1 ? sessions[index + 1] : null
    createPage({
      path: `/sessions/${session.slug}`,
      component: path.resolve(`./src/templates/session-detail.tsx`),
      context: {
        id: session.id,
        prev: prev && { slug: prev.slug, name: prev.name, sessionNumber: prev.sessionNumber },
        next: next && { slug: next.slug, name: next.name, sessionNumber: next.sessionNumber },
      },
    })
  })
}

export default createPages;
