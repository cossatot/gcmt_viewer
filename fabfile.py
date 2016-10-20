from fabric.api import run, sudo, env
from fabric.operations import reboot

env.hosts = ['54.224.242.199']
env.user = 'ec2-user'
env.key_filename = 'gcmt_viewer_test.pem'

def deploy():
    sudo('yum update -y')
    sudo('yum install -y docker')
    sudo('service docker start')
    sudo('usermod -a -G docker ec2-user')

    print('rebooting to register new user...')
    reboot(wait=60)
    print('okay we back')

    # run('docker pull segfaults/gcmt_viewer')
    sudo('curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > docker-compose')
    sudo('chown root docker-compose')
    sudo('mv docker-compose /usr/local/bin')
    sudo('chmod +x /usr/local/bin/docker-compose')
    # run('exit')

    sudo('yum install -y git')
    run('git clone https://github.com/Seg-Faults/gcmt_viewer.git')
    run('cd gcmt_viewer')
    print("***CHECKING OUT VERSION1.0***")
    run('git checkout version1.0')
    run('docker-compose up')
