## TABLES

  <ul>
  <li><h3>USER</h3></li>
  <ul>
  <li><h4>Basic Details</h4></li>
  <ul>
    <li>Name</li>
    <li>E-mail</li>
    <li>Username</li>
    <li>Password</li>
  </ul>
  
  <li>Role - Contributor or Viewer(Boolean)</li>
  <li>Rating(Numeric)</li>
  <li>A List of articles he follows(a list of ARTICLE table objects OR IDs)</li>
  <li>{if user is a contributor}List of articles he has posted(a list of ARTICLE table objects OR IDs)</li>
  </ul>
  <li><h3>ARTICLE</h3></li>
   <ul>
  <li>Title</li>
  <li>Summary</li>
  <li>Tagline(for easier classification)</li>
  <li>Contributor(a user row object)</li>
  <li>Publish datetime</li>
  <li>Reference links(for viewers to dive deeper)</li>
  <li>Comments({user : , priority : , body : [] , replies : [{user : , body : }]})</li>
  <li>Report Value(Numeric{reports * rating of each report})</li>
  </ul>
</ul>
