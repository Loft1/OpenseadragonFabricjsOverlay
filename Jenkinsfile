pipeline {
	agent {
		dockerfile {
			filename 'Dockerfile-Build'
		}
	}
	stages {
		stage('Setup') {
			steps {
				slackSend message: "Build Started - ${JOB_NAME} ${BUILD_NUMBER}"
				echo "Install NPM credentials"
				withCredentials([file(credentialsId: 'npmrc', variable: 'NPM_CRED')]) {
					sh "cp -fv $NPM_CRED ~/.npmrc"
				}
				sh 'npm install'
			}
		}
		stage('Lint') {
			steps {
				echo 'Linting code'
				sh 'tslint -p .'
			}
		}
		stage('Build') {
			steps {
				echo 'Enter build phase'
				sh 'npm run build'
			}
		}
		stage('Test') {
			steps {
				echo 'Enter test phase'
			}
		}
		stage('Deploy') {
			steps {
				echo 'Enter deploy phase'
				echo 'Publish to NPM'
				sh 'npm publish build || true'
			}
		}
	}
	post {
		success {
			slackSend message: "Build Succeeded. - ${JOB_NAME} ${BUILD_NUMBER}"
		}
		failure {
			slackSend color: 'danger', message: "@here Build Failed! - ${JOB_NAME} ${BUILD_NUMBER} (<${BUILD_URL}|Open>)"
		}
	}
}

