# LOGIN 

<ul>
  <li>Logging in with username/password  <h5>POST - username,password to backend to check if correct</h5><h5>GET - retrieve the info that current user state is this user</h5></li>
  <li>Creating account <h5>POST - new row in USER table</h5></li>
</ul>

# PROFILE PAGE

<ul>
  <li>Viewing user info <h5>GET - user row</h5></li>
  <li>Changing user info ?? <h5>PUT - user row</h5></li>
  <li>Viewing favourites <h5>GET - articles attribute from user -> findById twice</h5></li>
  <li>Viewing Posted <h5>GET - posted attribute from user -> findById twice</h5></li>
  <li>Deleting articles <h5>DELETE - delete article by checking which id from article attribute in user</h5></li>
  <li>add an article - options to add an image too(check file type) <h5>POST - new row in article</h5></li>
</ul>

# ARTICLE

<ul>
  <li>comment on it  <h5>PUT - in comment attribute in article</h5></li>
  <li>reply to it <h5>PUT - replies key of comment attribute of article</h5></li>
  <li>Report it <h5>PUT - channge report value of article</h5></li>
</ul>

