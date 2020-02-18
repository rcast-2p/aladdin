pid=`ps aux|grep pulse_bba|grep -v grep|awk '{ print $2}'`
echo $pid;
echo "temppwd"|sudo -S kill $pid
