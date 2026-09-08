pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'skillswap-ci'
        SERVER_PORT = '5002'
        CLIENT_PORT = '5175'
    }

    stages {
        stage('Validate Docker Compose') {
            steps {
                bat 'docker compose config -q'
            }
        }

        stage('Build Images') {
            steps {
                bat 'docker compose build --pull'
            }
        }

        stage('Start Services') {
            steps {
                bat 'docker compose up -d'
                bat 'docker compose ps'
            }
        }

        stage('Smoke Test') {
            steps {
                bat 'curl.exe --fail --retry 10 --retry-delay 3 http://localhost:5002/'
                bat 'curl.exe --fail --retry 10 --retry-delay 3 http://localhost:5175/'
            }
        }
    }

    post {
        always {
            bat 'docker compose ps'
        }
        failure {
            bat 'docker compose logs --no-color'
        }
        cleanup {
            bat 'docker compose down'
        }
    }
}
