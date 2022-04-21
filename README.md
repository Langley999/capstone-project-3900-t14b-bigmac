Set up a virtual environment
1. Set up Lubuntu 20.4.1 LTS virtual machine image in VirtualBox correctly using the instructions from this page.
2. Install nodejs(>= v16.14.0) and npm(>= 8.3.1) correctly.
  •	Suggested way to install nodejs:
      *	Download the latest tar.xz NodeJS file by running the following commands from https://nodejs.org/en/download/ 
      *	`tar  -xf  node-v#.#.#-linux-x64.tar.xz`
      *	`sudo mv node-v#.#.#-linux-x64/bin/* /usr/local/bin`
      *	`sudo mv node-v#.#.#-linux-x64/lib/node_modules/ /usr/local/lib/`
      where #.#.# is the version you download

3. Backend Configuration
Ensure an up-to-date Python version (>= 3.6.8) is downloaded

In ‘/capstone-project-3900-t14b-bigmac/backend/’ directory, run:
`pip3 install -r requirement.txt`
`pip3 install sympy`

4. Frontend Configuration
In ‘/capstone-project-3900-t14b-bigmac/frontend/’ directory, run:
`npm install`

3.1.2 Run our project

In ‘/capstone-project-3900-t14b-bigmac/backend/’ directory, run:
`python3 run.py`

In ‘/capstone-project-3900-t14b-bigmac/frontend/’ directory, run:
`npm start`

Navigate to http://localhost:3000/ in Google Chrome browser to use our book recommendation system!

