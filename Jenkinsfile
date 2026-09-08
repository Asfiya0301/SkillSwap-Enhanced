pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'skillswap-ci'
    }

    stages {
        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config -q'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build --pull'
            }
        }

        stage('Start Services') {
            steps {
                sh 'docker compose up -d'
                sh 'docker compose ps'
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'curl --fail --retry 10 --retry-delay 3 http://localhost:5001/'
                sh 'curl --fail --retry 10 --retry-delay 3 http://localhost:5174/'
            }
        }
    }

    post {
        always {
            sh 'docker compose ps || true'
        }
        failure {
            sh 'docker compose logs --no-color || true'
        }
        cleanup {
            sh 'docker compose down || true'
        }
    }
}
