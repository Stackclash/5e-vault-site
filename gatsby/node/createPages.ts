import type { GatsbyNode } from "gatsby"
import { slugify } from "../utils"
import path from "path"

interface SiteQueryResult {
  campaigns: {
    nodes: {
      id: string
      name: string
      slug: string
      parent: {
        internal: {
          contentFilePath: string
        }
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
      campaigns: allCampaign {
        nodes {
          id
          name
          slug
          parent {
            ... on Mdx {
              internal {
                contentFilePath
              }
            }
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

    createPage({
      path: `/${campaignSlug}`,
      component: `${path.resolve(`./src/templates/campaign-detail.tsx`)}?__contentFilePath=${campaign.parent.internal.contentFilePath}`,
      context: {
        id: campaign.id,
      }
    })
  })
}

export default createPages;