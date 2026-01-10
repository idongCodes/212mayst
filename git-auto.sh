#!/bin/bash

# Check if a commit message was provided (Argument 1)
if [ -z "$1" ]; then
  echo "❌ Error: Missing commit message."
  echo "Usage: ./git-auto.sh \"Your commit message\" [new-branch-name]"
  exit 1
fi

# 1. Stage all changes
echo "📦 Staging all changes..."
git add .

# 2. Commit changes
echo "💾 Committing with message: \"$1\""
git commit -m "$1"

# 3. Branch Handling
# If a second argument is provided, create a new branch
if [ -n "$2" ]; then
  echo "🌿 Creating and switching to new branch: $2"
  git checkout -b "$2"
  
  echo "🚀 Pushing new branch '$2' to origin..."
  git push -u origin "$2"

# Otherwise, push to the current branch
else
  current_branch=$(git symbolic-ref --short HEAD)
  echo "🚀 Pushing to current branch: $current_branch"
  git push origin "$current_branch"
fi

echo "✅ Done!"