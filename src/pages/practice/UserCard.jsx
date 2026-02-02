function UserCard(props){
<<<<<<< HEAD
  return(
      <>
      <p>{props.name}</p>
      {props.isPremium &&(
          <p>Premium Member</p>
      )}
      {!props.isPremium &&(
          <p>Standard member</p>
      )}

      </>
  );
=======
    return(
        <>
        <p>{props.name}</p>
        {props.isPremium &&(
            <p>Premium Member</p>
        )}
        {!props.isPremium &&(
            <p>Standard member</p>
        )}

        </>
    );
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
}
export default UserCard;