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
}

const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter
}) => {
  const { createPage } = actions

  const campaignResult = await graphql<SiteQueryResult>(`
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
    }
  `)

  if (campaignResult.errors) {
    reporter.panicOnBuild("Error loading campaigns", campaignResult.errors)
    return
  }

  const campaigns = campaignResult.data?.campaigns?.nodes ?? []

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
}

export default createPages;