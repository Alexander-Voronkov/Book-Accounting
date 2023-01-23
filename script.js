async function Book()
{
    const tphoto = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(new Uint8Array(fileReader.result));
        fileReader.readAsArrayBuffer(arguments[4]);
        });
    return{
        id:arguments[0],
        name:arguments[1],
        author:arguments[2],
        instock:arguments[3],
        photo:[...tphoto]
    };
}

const refresh = ()=>
{
    $('.books>tr').remove();
    for (let index = 0; index < localStorage.length; index++) {
        const temp = JSON.parse(localStorage.getItem(`book${/\d+/.exec(localStorage.key(index))[0]}`));
        const row = document.createElement('tr');
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type','checkbox');
        const check = document.createElement('td');
        const id = document.createElement('td');
        const name = document.createElement('td');
        const author = document.createElement('td');
        const instock = document.createElement('td');
        const photo = document.createElement('td');
        $(check).append(checkbox);
        id.textContent = temp.id;
        name.textContent = temp.name;
        author.textContent = temp.author;
        instock.textContent = temp.instock;
        photo.style.backgroundImage = `url(${URL.createObjectURL(new Blob([new Uint8Array(temp.photo).buffer],{type:'image/jpeg'}))})`;
        photo.style.backgroundSize = 'contain';
        photo.style.backgroundRepeat = 'no-repeat';
        photo.style.backgroundPosition = 'center';
        $('.books').append(row);
        $(row).append(check);
        $(row).append(id);
        $(row).append(name);
        $(row).append(author);
        $(row).append(instock);
        $(row).append(photo); 
    } 
    $('tr:not(:first-child)>td:not(:last-child)').unbind('click');
    $('tr:not(:first-child)>td:not(:last-child)').click((e)=>
    {
        if(e.target.tagName!=='INPUT')
        {
            $(e.target.parentElement.firstElementChild.firstElementChild).click();
        }
    });
    $('tr:not(:first-child)>td:last-child').unbind('click');
    $('tr:not(:first-child)>td:last-child').click((x)=>
    {
        document.querySelector('.modal-image-i').style.backgroundImage = x.target.style.backgroundImage;
        $('.modal-image').slideToggle();
        $('.modal-image').css('display','flex');
    });
};

$('.close-modal-w').click(()=>
{
    $('.modal-window').slideToggle();
});

$('.close-modal-i').click(()=>
{
    $('.modal-image').slideToggle();
});

$('.modal-image').click((e)=>
{
    if(e.target===document.querySelector('.modal-image'))
    {
        $('.modal-image').slideToggle();
    }
});

document.addEventListener('DOMContentLoaded',refresh);

$('.add-btn').click(()=>
{
    $('.modal-window').slideToggle();
    $('.modal-window').css('display','flex');
});

$('.modal-window').click((e)=>
{
    if(e.target===document.querySelector('.modal-window'))
        $(e.target).slideToggle();
});

$('.add-form').submit(async (e)=>
{
    e.preventDefault();  
    const id = localStorage.length;
    const book = await Book(id, $('#bookname').val(), $('#bookauthor').val(),$('#bookinstock').val(),document.querySelector('#bookphoto').files[0]);
    localStorage.setItem(`book${id}`, JSON.stringify(book)); 
    $('.modal-window').slideToggle();
    refresh(); 
});

$('.remove-btn').click(()=>
{
    if(document.querySelectorAll('input[type=checkbox]:checked').length==0)
    {
        alert('Choose at least one book to remove!');
        return;
    }
    document.querySelectorAll('input[type=checkbox]').forEach(x=>
    {
        if(x.checked)
        {
            const index = parseInt($(x.parentElement.parentElement).children('*:nth-child(2)').text());
            localStorage.removeItem(`book${index}`);
            $(x.parentElement.parentElement).remove();
        }
    });
});

$('.searchbtn').click(()=>
{
    if($('.search-input').val().length==0)
    {
        alert('Nothing has been found.');
        return;
    }
    $('input[type=checkbox]').prop('checked',false);
    let f = false;
    document.querySelectorAll('td').forEach(x=>
        {
            if($(x).text().toLowerCase().includes($('.search-input').val().toLowerCase()))
            {
                $('html, body').animate({scrollTop:$(x).offset().top},100);
                $(x).click();
                f=true;
            }
        });  
    if(!f)
        alert('Nothing has been found.');  
});

$('.close-modal-c').click(()=>
{
    $('.modal-window-change').slideToggle();
});

$('.modal-window-change').click((e)=>
{
    if(e.target===document.querySelector('.modal-window-change'))
        $(e.target).slideToggle();
});


$('.change-btn').click(()=>
{    
    if(document.querySelectorAll('.books>*').length==1)
    {
        alert('You don\'t have any books yet!');
        return;
    }
    if(document.querySelectorAll('input[type=checkbox]:checked').length==0||document.querySelectorAll('input[type=checkbox]:checked').length>1)
    {
        alert('You need to choose only one book to change it!');
        return;
    }
    const tr = document.querySelector('input[type=checkbox]:checked').parentElement.parentElement;
    $('.change-form').data('id', $(tr).children(':nth-child(2)').text());
    $('#booknamechange').val($(tr).children(':nth-child(3)').text());
    $('#bookauthorchange').val($(tr).children(':nth-child(4)').text());
    $('#bookinstockchange').val($(tr).children(':nth-child(5)').text());
    const book = JSON.parse(localStorage.getItem(`book${$('.change-form').data('id')}`));
    const dt = new DataTransfer();
    const file = new File([new Uint8Array(book.photo).buffer],'image.jpeg',{type:'image/jpeg'});
    dt.items.add(file);
    document.querySelector('#bookphotochange').files = dt.files;
    $('.modal-window-change').slideToggle();
    $('.modal-window-change').css('display','flex');
});

$('.change-form').submit(async (e)=>
{
    e.preventDefault();
    const book = await Book($('.change-form').data('id'), $('#booknamechange').val(), $('#bookauthorchange').val(), $('#bookinstockchange').val(), $('#bookphotochange').prop('files')[0]);
    localStorage.setItem(`book${$('.change-form').data('id')}`, JSON.stringify(book)); 
    refresh();
    $('.modal-window-change').slideToggle();
});

$('.icon').click(()=>
{
    $('html, body').animate({scrollTop:0});
});


$('.books>thead>tr>th:nth-child(n+2):nth-child(-n+5)').click((e)=>
{
    const arr = [];
    for (let index = 0; index < localStorage.length; index++) {
        arr.push(JSON.parse(localStorage.getItem(localStorage.key(index))));
    }
    switch($(e.target).text())
    {
        case 'Id' : 
        {
            if(sessionStorage.getItem('id')==='asc')
            {
                arr.sort((a,b)=>a.id-b.id);
                sessionStorage.setItem('id','desc');
            }
            else if(sessionStorage.getItem('id')==='desc'||sessionStorage.getItem('id')===null)
            {
                arr.sort((a,b)=>b.id-a.id);
                sessionStorage.setItem('id','asc');
            }
        }; break;
        case 'Name' :
        {
            if(sessionStorage.getItem('name')==='desc')
            {
                arr.sort((a,b)=>a.name<b.name?1:-1);
                sessionStorage.setItem('name','asc');
            }  
            else if(sessionStorage.getItem('name')==='asc'||sessionStorage.getItem('name')===null)
            {
                arr.sort((a,b)=>a.name>b.name?1:-1);
                sessionStorage.setItem('name','desc');
            }  
        }; break;
        case 'Author' : 
        {
            if(sessionStorage.getItem('author')==='desc')
            {
                arr.sort((a,b)=>a.author>b.author?1:-1);
                sessionStorage.setItem('author','asc');
            }  
            else if(sessionStorage.getItem('author')==='asc'||sessionStorage.getItem('author')===null)
            {
                arr.sort((a,b)=>a.author<b.author?1:-1);
                sessionStorage.setItem('author','desc');
            }  
        };break;
        case 'In stock' :
        {
            if(sessionStorage.getItem('instock')==='desc')
            {
                arr.sort((a,b)=>parseInt(a.instock)-parseInt(b.instock));
                sessionStorage.setItem('instock','asc');
            }  
            else if(sessionStorage.getItem('instock')==='asc'||sessionStorage.getItem('instock')===null)
            {
                arr.sort((a,b)=>parseInt(b.instock)-parseInt(a.instock));
                sessionStorage.setItem('instock','desc');
            }  
        };break;
    }

    $('.books>tr').remove();
    for (let index = 0; index < arr.length; index++) {
        const temp = arr[index];
        const row = document.createElement('tr');
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type','checkbox');
        const check = document.createElement('td');
        const id = document.createElement('td');
        const name = document.createElement('td');
        const author = document.createElement('td');
        const instock = document.createElement('td');
        const photo = document.createElement('td');
        $(check).append(checkbox);
        id.textContent = temp.id;
        name.textContent = temp.name;
        author.textContent = temp.author;
        instock.textContent = temp.instock;
        photo.style.backgroundImage = `url(${URL.createObjectURL(new Blob([new Uint8Array(temp.photo).buffer],{type:'image/jpeg'}))})`;
        photo.style.backgroundSize = 'contain';
        photo.style.backgroundRepeat = 'no-repeat';
        photo.style.backgroundPosition = 'center';
        $('.books').append(row);
        $(row).append(check);
        $(row).append(id);
        $(row).append(name);
        $(row).append(author);
        $(row).append(instock);
        $(row).append(photo);
    }
    $('tr:not(:first-child)>td:not(:last-child)').unbind('click');
    $('tr:not(:first-child)>td:not(:last-child)').click((e)=>
    {
        if(e.target.tagName!=='INPUT')
        {
            $(e.target.parentElement.firstElementChild.firstElementChild).click();
        }
    });
    $('tr:not(:first-child)>td:last-child').unbind('click');
    $('tr:not(:first-child)>td:last-child').click((x)=>
    {
        document.querySelector('.modal-image-i').style.backgroundImage = x.target.style.backgroundImage;
        $('.modal-image').slideToggle();
        $('.modal-image').css('display','flex');
    });
});













