import axios from 'axios';
import mongoose from 'mongoose';

function mapGithubRepoToProject(repo) {
  return {
    title: repo.name,
    description: repo.description || "No description provided",
    createdBy: null, // This will need to be set when saving to the database
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

export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      params: {
        sort: 'updated',
        per_page: 100
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const projects = response.data.map(mapGithubRepoToProject);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching GitHub projects:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'GitHub user not found' });
    } else {
      res.status(500).json({ message: 'Error fetching GitHub projects' });
    }
  }
}