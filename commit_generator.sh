#!/bin/bash

# Function to generate random number between min and max
random_number() {
    local min=$1
    local max=$2
    echo $((RANDOM % (max - min + 1) + min))
}

# Function to generate random commit message
generate_commit_message() {
    local messages=(
        "Update component styles"
        "Fix bug in authentication"
        "Add new feature"
        "Refactor code"
        "Update dependencies"
        "Improve performance"
        "Add documentation"
        "Fix typo"
        "Update tests"
        "Optimize database queries"
        "Add error handling"
        "Update UI components"
        "Fix security issue"
        "Add new API endpoint"
        "Update configuration"
    )
    echo "${messages[$RANDOM % ${#messages[@]}]}"
}

# Function to generate random time
generate_random_time() {
    local hour=$((RANDOM % 24))
    local minute=$((RANDOM % 60))
    local second=$((RANDOM % 60))
    printf "%02d:%02d:%02d" $hour $minute $second
}

# Get list of all files in the repository
get_all_files() {
    find . -type f -not -path "*/\.*" -not -path "*/node_modules/*" -not -path "*/dist/*"
}

# Main script
files=($(get_all_files))
total_files=${#files[@]}

# March 19-31
for day in {19..31}; do
    month="Mar"
    # Generate random number of commits for this day (6-20)
    num_commits=$(random_number 6 20)

    echo "Generating $num_commits commits for $month $day, 2025"

    for ((i=1; i<=num_commits; i++)); do
        # Select a random file
        file_index=$((RANDOM % total_files))
        file=${files[$file_index]}

        # Stage the file
        git add "$file"

        time=$(generate_random_time)
        commit_message=$(generate_commit_message)

        # Format the date string
        date_string="$month $day $time 2025 +0000"

        # Create the commit
        GIT_COMMITTER_DATE="$date_string" git commit --date="$date_string" -m "$commit_message"

        echo "Committed $file with message: $commit_message"
    done
done

# April 1-2
for day in {1..2}; do
    month="Apr"
    # Generate random number of commits for this day (6-20)
    num_commits=$(random_number 6 20)

    echo "Generating $num_commits commits for $month $day, 2025"

    for ((i=1; i<=num_commits; i++)); do
        # Select a random file
        file_index=$((RANDOM % total_files))
        file=${files[$file_index]}

        # Stage the file
        git add "$file"

        time=$(generate_random_time)
        commit_message=$(generate_commit_message)

        # Format the date string
        date_string="$month $day $time 2025 +0000"

        # Create the commit
        GIT_COMMITTER_DATE="$date_string" git commit --date="$date_string" -m "$commit_message"

        echo "Committed $file with message: $commit_message"
    done
done