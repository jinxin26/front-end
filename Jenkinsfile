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
            causeString: 'Triggered by github webhook on commit $commit to $ref by $committer',
            printContributedVariables: true,
            printPostContent: true,
            silentResponse: true
    )
  }

  environment {
    SERVICE = 'front-end'
    KUBE_CONFIG = credentials('KUBE_CONFIG')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
                $class                           : 'GitSCM',
                branches                         : [[name: '*/dev']],
                doGenerateSubmoduleConfigurations: false
        ])
      }
    }

    stage('Test') {
      steps {
        sh '''
         set +x
         ./ci/run-test.sh
         '''
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

    stage('GenImage') {
      steps {
        sh '''
         set +x
         ./ci/gen-image.sh
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
