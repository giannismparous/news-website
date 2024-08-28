import React from 'react';
import '../styles/Terms.css'; // Import the Contact CSS
import { Helmet } from 'react-helmet-async';

const Terms = () => {


    return (
        <div className="terms-container">
            <Helmet>
                <title>Όροι Χρήσης</title>  
                <meta name="description" content="Όροι χρήσης της ιστοσελίδα Syntaktes.gr"/>
                <link rel="canonical" href="/terms"/>
            </Helmet>
            <h1>Όροι Χρήσης</h1>
            <h2>1. Εισαγωγή</h2>
            <p>Η χρήση της ιστοσελίδας syntaktes.gr διέπεται από τους παρόντες όρους χρήσης. Με την πρόσβαση και χρήση της ιστοσελίδας syntaktes.gr, αποδέχεστε ότι δεσμεύεστε από αυτούς τους όρους. Εάν δεν συμφωνείτε με κάποιον από τους όρους, παρακαλούμε να μην χρησιμοποιήσετε την ιστοσελίδα μας.</p>
            <h2>2. Πνευματική Ιδιοκτησία</h2>
            <p>Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων, αλλά όχι περιοριστικά, κειμένων, εικόνων, γραφικών, και λογισμικού, προστατεύεται από τη νομοθεσία περί πνευματικής ιδιοκτησίας και ανήκει στην ιστοσελίδα ή στους νόμιμους δικαιούχους τους. Απαγορεύεται η αναπαραγωγή, διανομή, τροποποίηση ή εκμετάλλευση του περιεχομένου χωρίς την προηγούμενη γραπτή συγκατάθεση του κατόχου.</p>

            <h2>3. Περιορισμός Ευθύνης</h2>
            <p>Η ιστοσελίδα μας παρέχεται "ως έχει" και χωρίς καμία εγγύηση, είτε ρητή είτε σιωπηρή. Παρόλο που καταβάλλουμε κάθε προσπάθεια για να διασφαλίσουμε την ακρίβεια και την επικαιροποίηση του περιεχομένου, δεν φέρουμε καμία ευθύνη για τυχόν λάθη ή παραλείψεις. Η χρήση της ιστοσελίδας γίνεται με δική σας ευθύνη.</p>

            <h2>4. Σύνδεσμοι σε Τρίτες Ιστοσελίδες</h2>
            <p>Η ιστοσελίδα μας μπορεί να περιέχει συνδέσμους προς τρίτες ιστοσελίδες. Αυτοί οι σύνδεσμοι παρέχονται για την εξυπηρέτησή σας και δεν σημαίνουν ότι εγκρίνουμε ή φέρουμε ευθύνη για το περιεχόμενο αυτών των ιστοσελίδων. Η πρόσβαση σε αυτές γίνεται με δική σας ευθύνη.</p>

            <h2>5. Προσωπικά Δεδομένα</h2>
            <p>Η διαχείριση των προσωπικών σας δεδομένων γίνεται σύμφωνα με την Πολιτική Απορρήτου μας, την οποία μπορείτε να βρείτε εδώ. Με τη χρήση της ιστοσελίδας, συμφωνείτε με τη συλλογή και χρήση των δεδομένων σας σύμφωνα με την Πολιτική Απορρήτου.</p>

            <h2>6. Τροποποίηση Όρων</h2>
            <p>Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους χρήσης ανά πάσα στιγμή χωρίς προειδοποίηση. Οποιαδήποτε τροποποίηση θα αναρτάται σε αυτή τη σελίδα, και η συνέχιση της χρήσης της ιστοσελίδας μετά την ανάρτηση των τροποποιημένων όρων συνιστά αποδοχή των αλλαγών.</p>

            <h2>7. Εφαρμοστέο Δίκαιο και Δικαιοδοσία</h2>
            <p>Οι παρόντες όροι χρήσης διέπονται από την ελληνική νομοθεσία. Οποιαδήποτε διαφορά προκύψει από τη χρήση της ιστοσελίδας θα υπάγεται στην αποκλειστική δικαιοδοσία των δικαστηρίων της Αθήνας.</p>

            <h2>8. Επικοινωνία</h2>
            <p>Για οποιαδήποτε απορία ή διευκρίνιση σχετικά με τους παρόντες όρους χρήσης, μπορείτε να επικοινωνήσετε μαζί μας στο syntaktes@syntaktes.gr.</p>

        </div>
    );
};

export default Terms;
