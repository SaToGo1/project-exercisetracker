# Exercise Tracker
Development of an application that allows to register exercises for the users and saves the information of the exercises in a mongoDB Database.
Project made from a FreeCodeCamp project template, index.js and model made by me.

## Made with
<table>
  <tr>
    <td><p>Javascript</p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png" alt="javascript" width="100px" height="100px"></td>
    <td><p>HTML</p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1024px-HTML5_logo_and_wordmark.svg.png" alt="html" width="100px" height="100px"></td>
    <td><p>CSS</p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/800px-CSS3_logo_and_wordmark.svg.png" alt="css" width="100px" height="100px"></td>
    <td><p>nodeJs</p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1920px-Node.js_logo.svg.png" alt="node" width="100px" height="100px"></td>
    <td><p>express</p><img src="https://geekflare.com/wp-content/uploads/2023/01/expressjs.png" alt="express" width="100px" height="100px"></td>
    <td><p>mongoDB</p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1920px-MongoDB_Logo.svg.png" alt="MongoDB" width="100px" height="100px"></td>
  </tr>
</table>

## [Live Demo](https://project-exercisetracker.satogo.repl.co/)
![image](https://github.com/SaToGo1/project-exercisetracker/assets/85353835/a7a8cfe7-dd1d-4f94-868d-624677ef2ae6)

## Example of requests

make an user and save the id example:   
- 6490e1b154f05f59a5715ff3

Check the exercises save in a specific users:  
- /api/users/6490e1b154f05f59a5715ff3/logs
- /api/users/:_id/logs

Check the exercises save from date1 to date2:  
- /api/users/6490e1b154f05f59a5715ff3/logs?from=2023-06-19&to=2023-06-20
- /api/users/:_id/logs?[from][&to]

Check the logs of the user limiting the amount of resullts you get:
- /api/users/6490e1b154f05f59a5715ff3/logs?limit=1
- /api/users/:_id/logs?[limit]

# FreeCodeCamp

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker
