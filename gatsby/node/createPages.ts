import type { GatsbyNode } from "gatsby"
import { slugify } from "../utils"
import path from "path"

interface SiteQueryResult {
  campaigns: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      internal: {
        contentFilePath: string
      }
    }[]
  }
  parties: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
  sessions: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
  worlds: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
  npcs: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
  locations: {
    nodes: {
      id: string
      fields: {
        name: string
        locationRef: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
  quests: {
    nodes: {
      id: string
      fields: {
        name: string
      }
      campaigns: {
        fields: {
          name: string
        }
      }[]
      internal: {
        contentFilePath: string
      }
    }[]
  }
}

const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter
}) => {
  const { createPage } = actions

  const campaignResult = await graphql<SiteQueryResult>(`
    query Data {
      campaigns: allMdx(filter: {fields: {entityType: {eq: "campaign"}}}) {
        nodes {
          id
          fields {
            name
          }
          internal {
            contentFilePath
          }
        }
      }
      parties: allMdx(filter: {fields: {entityType: {eq: "party"}}}) {
        nodes {
          id
          fields {
            name
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
      sessions: allMdx(filter: {fields: {entityType: {eq: "session"}}}) {
        nodes {
          id
          fields {
            name
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
      worlds: allMdx(filter: {fields: {entityType: {eq: "world"}}}) {
        nodes {
          id
          fields {
            name
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
      npcs: allMdx(filter: {fields: {entityType: {eq: "npc"}}}) {
        nodes {
          id
          fields {
            name
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
      locations: allMdx(filter: {fields: {entityType: {eq: "location"}}}) {
        nodes {
          id
          fields {
            name
            locationRef
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
      quests: allMdx(filter: {fields: {entityType: {eq: "quest"}}}) {
        nodes {
          id
          fields {
            name
          }
          campaigns {
            fields {
              name
            }
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (campaignResult.errors) {
    reporter.panicOnBuild("Error loading campaigns", campaignResult.errors)
    return
  }

  const campaigns = campaignResult.data?.campaigns?.nodes ?? []
  const parties = campaignResult.data?.parties?.nodes ?? []
  const sessions = campaignResult.data?.sessions?.nodes ?? []
  const worlds = campaignResult.data?.worlds?.nodes ?? []
  const npcs = campaignResult.data?.npcs?.nodes ?? []
  const locations = campaignResult.data?.locations?.nodes ?? []
  const quests = campaignResult.data?.quests?.nodes ?? []

  // Group all entities by campaign
  const campaignEntities = campaigns.map(campaign => {
    const campaignName = campaign.fields.name
    return {
      campaign,
      parties: parties.filter(p => p.campaigns?.some(c => c.fields.name === campaignName)),
      sessions: sessions.filter(s => s.campaigns?.some(c => c.fields.name === campaignName)),
      worlds: worlds.filter(w => w.campaigns?.some(c => c.fields.name === campaignName)),
      npcs: npcs.filter(n => n.campaigns?.some(c => c.fields.name === campaignName)),
      locations: locations.filter(l => l.campaigns?.some(c => c.fields.name === campaignName)),
      quests: quests.filter(q => q.campaigns?.some(c => c.fields.name === campaignName)),
    }
  })

  campaignEntities.forEach(({ campaign, parties, sessions, worlds, npcs, locations, quests }) => {
    const campaignSlug = slugify(campaign.fields.name)

    // createPage({
    //   path: `/${campaignSlug}`,
    //   component: `${path.resolve(`./src/templates/campaign-detail.tsx`)}?__contentFilePath=${campaign.internal.contentFilePath}`,
    //   context: {
    //     id: campaign.id,
    //   }
    // })
  })
}

export default createPages;