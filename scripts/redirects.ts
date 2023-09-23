import fs from 'fs-extra'
import { Octokit } from '@octokit/rest'
import fetch from 'node-fetch'

const pages = 2

async function run() {
  const manual = await fs.readFile('_redirects', 'utf-8')

  const gh = new Octokit({
    // auth: process.env.GITHUB_TOKEN!,
    request: {
      fetch,
    },
  })

  const redirects: [string, string, number][] = []

  for (let i = 1; i <= pages; i++) {
    const { data: repos } = await gh.repos.listForUser({
      type: 'owner',
      username: 'wearzdk',
      per_page: 100,
      page: i,
    })

    for (const repo of repos) {
      if (['test', 'static', 'repro', 'issue', 'resume', 'wearzdk'].some(i => repo.name.includes(i)))
        continue
      if (!repo.private && !repo.fork && !repo.archived)
        redirects.push([`/${repo.name}`, repo.html_url, 302])
    }
  }

  const final = `${manual}\n${redirects.map(i => i.join('\t')).join('\n')}`

  await fs.writeFile('_dist_redirects', final, 'utf-8')
}

run()