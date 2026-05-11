pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/MahitaChintakula/schemefinder_team6'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Deploy To EC2') {
            steps {

                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2-server',

                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/**',
                                    removePrefix: 'dist',
                                     remoteDirectory: '',

                                    execCommand: '''
                                    sudo systemctl restart nginx
                                    '''
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }
}
