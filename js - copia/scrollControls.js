// ✅ scrollControls.js
function scrollCategories(d=1){const b=document.querySelector('.categories-bar');if(b)b.scrollBy({left:d*200,behavior:'smooth'})}
function scrollSubcategories(d=1){const b=document.getElementById('subcategories-container');if(b)b.scrollBy({left:d*200,behavior:'smooth'})}
window.scrollCategories=scrollCategories;window.scrollSubcategories=scrollSubcategories;