/**
 * Department Footer Component
 * EXACT replica of department/partials/footer.blade.php from old CMDMS
 * Simple copyright text only - no "Powered By" or Urdu text
 */

export function DepartmentFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="d-sm-flex justify-content-center justify-content-sm-between">
        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
          Copyright © {currentYear} <a href="#" target="_blank" rel="noreferrer"></a>. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

