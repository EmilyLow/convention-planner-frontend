import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';


export default function LogIn(props) {


    return(
        <Dialog open={props.open} onClose = {props.handleClose}>
            <DialogTitle>Title</DialogTitle>

        </Dialog>
      
    )
}