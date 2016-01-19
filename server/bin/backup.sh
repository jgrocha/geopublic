#!/bin/bash

data=`date +%Y%m%d%H%M`
log=~/backup/$data.log

# Contents

backupparticipationdata=~/backup/participation_data_$data.tgz
backupuploadedimages=~/backup/uploaded_images_$data.tgz

tar cvzf $backupparticipationdata ~/public_html/public/participation_data >> $log 2>&1
tar cvzf $backupuploadedimages ~/public_html/public/uploaded_images >> $log 2>&1

# remove backups older than a mounth (+30 days)
find ~/backup -type f -mtime +30 -name '*'.tgz -exec rm -f \{\} \;

# Database

bds="geopublic"

# db passwords should be in ~/.pgpass
for bd in $bds
do
	backupfile=~/backup/$bd_$data.backup
	pg_dump -h localhost -p 5432 -U geobox --no-password -F c -O -v -f $backupfile $bd >> $log 2>&1
done

# remove backups older than a mounth (+30 days)
find ~/backup -type f -mtime +30 -name '*'.backup -exec rm -f \{\} \;
find ~/backup -type f -mtime +30 -name '*'.log -exec rm -f \{\} \;

# copy to remote host if keys are defined
# scp $backupfile jgr@geomaster.pt:backup
# scp $backupparticipationdata jgr@geomaster.pt:backup
# scp $backupuploadedimages jgr@geomaster.pt:backup