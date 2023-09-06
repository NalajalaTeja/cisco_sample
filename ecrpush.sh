echo "***************************** deployment ********************************"
git branch
echo "***************************** git pull ********************************"
git pull --ff
git log -1
npm i
git add .
git commit -m "new code update"
git push 
nodemon
