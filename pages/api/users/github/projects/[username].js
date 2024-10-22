import axios from 'axios';
import getProjectModel from '../../../../../models/Project';
import { authMiddleware, ownershipMiddleware, withErrorHandling } from '../../../middleware/authMiddleware';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}` // Access token from env variables
  }
});

function mapGithubRepoToProject(repo) {
  return {
    title: repo.name,
    description: repo.description || "No description provided",
    createdBy: null,
    likes: [],
    likesCount: 0,
    tags: repo.topics || [],
    category: "GitHub Project",
    imageUrl: repo.owner.avatar_url,
    projectUrl: repo.html_url,
    githubId: repo.id,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    language: repo.language,
    lastUpdated: new Date(repo.updated_at),
  };
}

export async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const rateLimit = await githubApi.get('/rate_limit');
    console.log('GitHub API Rate Limit:', {
      remaining: rateLimit.data.rate.remaining,
      limit: rateLimit.data.rate.limit,
      resetAt: new Date(rateLimit.data.rate.reset * 1000).toLocaleString()
    });

    if (rateLimit.data.rate.remaining < 1) {
      return res.status(429).json({
        message: 'GitHub API rate limit exceeded',
        resetAt: new Date(rateLimit.data.rate.reset * 1000).toLocaleString()
      });
    } 

    // Fetch repositories
    const response = await githubApi.get(`/users/${username}/repos`, {
      params: {
        sort: 'updated',
        per_page: 100
      }
    });

    const projects = response.data.map(mapGithubRepoToProject);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching GitHub projects:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      headers: error.response?.headers
    });

    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    } else if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid GitHub access token' });
    } else if (error.response?.status === 403) {
      return res.status(403).json({ message: 'GitHub API rate limit exceeded' });
    }

    res.status(500).json({ message: 'Error fetching GitHub projects' });
  }
}

export default withErrorHandling(handler);