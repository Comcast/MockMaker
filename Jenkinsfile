#!groovy
node('ace-jenkins-slave') {
    timestamps {
        notifyBuild('STARTED')
        try {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'NEXUS', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD'], [$class: 'UsernamePasswordMultiBinding', credentialsId: 'sonar', usernameVariable: 'SONAR_USERNAME', passwordVariable: 'SONAR_PASS']]) {
                stage('checkout') {
                    checkout scm
                }
                sh "git rev-parse --short HEAD > .git/commit-id"
                def commit_id = readFile('.git/commit-id')
                def branchName = env.BRANCH_NAME
                def tag = tagName(branchName)

                stage('build for Comcast') {
                    sh "DOCKER_TAG=${tag} make build"
                }

                stage('build chart') {
                    sh "make chart-build"
                }

                if (shouldPush(branchName)) {
                  stage('push for Comcast') {
                    sh "DOCKER_TAG=${tag} make push"
                  }
                  stage('push chart') {
                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jenkins-ci-comcast-github', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PASSWORD']]) {
                        sh "GITHUB_USER=${GITHUB_USER} GITHUB_PASSWORD=${GITHUB_PASSWORD} TAG_NAME=${tag} make chart-push"
                    }
                  }
                }

                if (shouldTag(branchName)) {
                    stage('tag') {
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jenkins-ci-comcast-github', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PASSWORD']]) {
                            sh "GITHUB_USER=${GITHUB_USER} GITHUB_PASSWORD=${GITHUB_PASSWORD} TAG_NAME=${tag} make tag"
                        }
                    }
                }
            }
        } catch (Exception e) {
            currentBuild.result = "FAILED"
            throw e
        } finally {
            notifyBuild(currentBuild.result)
            deleteDir()
        }
    }
}

def tagName(branchName) {
    def versionPrefix = branchName
    def versionSuffix = ".${env.BUILD_NUMBER}"
    if (branchName == 'master') {
      return "latest"
    } else {
      return "${versionPrefix}${versionSuffix}"
    }
}

def shouldTag(branchName) {
    branchName =~ /^(\d+\.)+(\d+)$/
}

def shouldPush(branchName) {
    branchName == "master" || branchName =~ /^(\d+\.)+(\d+)$/
}

def notifyBuild(String buildStatus) {

    //build status of null means successful
    buildStatus = buildStatus ?: 'SUCCESSFUL'

    // Override default values based on build status
    if (buildStatus == 'STARTED') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESSFUL') {
        color = 'GREEN'
        colorCode = '#00FF00'
    } else {
        color = 'RED'
        colorCode = '#FF0000'
    }

    def details = """*${buildStatus}: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]:*
    Check console output at ${env.BUILD_URL}/console"""
    slackSend(color: colorCode, message: details)
}
