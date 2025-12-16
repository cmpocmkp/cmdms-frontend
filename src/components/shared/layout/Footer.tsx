/**
 * Footer Component
 * EXACT replica of admin/partials/footer.blade.php
 */

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="d-sm-flex justify-content-center justify-content-sm-between">
        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
          Powered By: Khyber Pakhtunkhwa Information Technology Board (KPITB) © {currentYear} All rights reserved.
        </span>
        <span style={{ fontSize: '20px' }} className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
          اختیار عوام کا{' '}
          <i className="ti-hand-drag"></i>
          <i className="mdi mdi-account-multiple"></i>
          <i className="fa fa-users"></i>
          <i className="mdi mdi-account-multiple"></i>
          <i className="ti-hand-drag"></i>
        </span>
      </div>
    </footer>
  );
}

