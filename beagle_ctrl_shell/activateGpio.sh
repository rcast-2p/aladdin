echo $@;
for i in $@
	do 
	echo $i
	
if [ -e "/sys/class/gpio/gpio${i}" ];then
	echo "gpio ${i} exist"
else
	echo "temppwd"| sudo -S echo $i >/sys/class/gpio/export
	sleep 1
	echo "/sys/class/gpio/gpio${i}/direction"
	echo "temppwd"| sudo -S echo "out" >"/sys/class/gpio/gpio${i}/direction"
fi
done
