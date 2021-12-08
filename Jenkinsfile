pipeline {
  agent any
  triggers {
    GenericTrigger(
            genericVariables: [
                    [key: 'commit', value: '$.commits[0].id'],
                    [key: 'committer', value: '$.commits[0].committer.name'],
                    [key: 'ref', value: '$.ref']
            ],
            token: 'front-end',
            printContributedVariables: true,
            printPostContent: true,
            silentResponse: true
    )
  }

  environment {
    SERVICE = 'front-end'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
                $class                           : 'GitSCM',
                branches                         : [[name: '*/master']],
                doGenerateSubmoduleConfigurations: false
        ])
      }
    }

    stage('Build') {
      steps {
        sh '''
         set +x
         ./ci/build.sh
         '''
      }
    }

    stage('DeployToDev') {
      steps {
        sh '''
         set +x
         ./ci/deploy.sh dev
         '''
      }
    }

  stage('Confirm QA') {
      options {
          timeout(time: 60, unit: 'SECONDS')
      }

      input {
          message 'Do you want to delpoy to QA?'
          ok 'Yes, go ahead.'
      }

      steps {
          sh '''
          set +x
          ./ci/deploy.sh qa
          '''
      }
    }

    stage('Confirm staging') {
      options {
          timeout(time: 60, unit: 'SECONDS')
      }

      input {
          message 'Do you want to delpoy to staging?'
          ok 'Yes, go ahead.'
      }

      steps {
          sh '''
          set +x
          ./ci/deploy.sh staging
          '''
      }
    }

    stage('Confirm prod') {
      options {
          timeout(time: 60, unit: 'SECONDS')
      }

      input {
          message 'Do you want to delpoy to prod?'
          ok 'Yes, go ahead.'
      }

      steps {
          sh '''
              set +x
              ./ci/deploy.sh prod
              '''
      }
    }
  }
}
