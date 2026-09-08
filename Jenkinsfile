pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'skillswap-ci'
        SERVER_PORT = '5002'
        CLIENT_PORT = '5175'
        MONGO_PORT = '27018'
        DOCKER_HOST = 'npipe:////./pipe/dockerDesktopLinuxEngine'
        PATH_PLUS_DOCKER = 'C:\\Users\\admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin'
    }

    stages {
        stage('Check Docker') {
            steps {
                bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker version && docker-compose version'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose config -q'
            }
        }

        stage('Build Images') {
            steps {
                bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose build --pull'
            }
        }

        stage('Start Services') {
            steps {
                bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose up -d'
                bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose ps'
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
            bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose ps || exit /b 0'
        }
        failure {
            bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose logs --no-color || exit /b 0'
        }
        cleanup {
            bat 'set "PATH=%PATH%;%PATH_PLUS_DOCKER%" && docker-compose down || exit /b 0'
        }
    }
}
