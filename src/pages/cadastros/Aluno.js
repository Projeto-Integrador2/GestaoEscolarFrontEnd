import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {AlunoService} from '../../service/cadastros/AlunoService';
import Axios from 'axios';

const Aluno = () => {

    let objetoNovo = {
        nomeAluno: '',
        cpfAluno: '',
        emailAluno: '',
        telefoneAluno: '',
        observacaoAluno: '',
    };

    const [objetos, setObjetos] = useState(null);
    const [objeto, setObjeto] = useState(objetoNovo);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [atualizar, setAtualizar] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const objetoService = new AlunoService();

    useEffect(() => {
        if (objetos == null) {
            objetoService.alunos().then(res => {
                setObjetos(res.data);
            })
        }
    }, [objetoService, objetos]);

    function listarAlunos() {
        Axios.get("http://localhost:8080/gems/aluno/").then(result => {
            setObjetos(result.data);
        });
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editObjeto(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteObjeto(rowData)}/>
            </div>
        );
    }

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    }

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    }

    const saveObjeto = () => {
        setSubmitted(true);

        if (objeto.nome.trim()) {
            let _objeto = {...objeto};
            if (objeto.id) {
                objetoService.alterar(_objeto).then(data => {
                    toast.current.show({severity: 'success', summary: 'Sucesso', detail: "Alterado"});
                    setObjetos(null);
                })
            } else {
                objetoService.inserir(_objeto).then(data => {
                    toast.current.show({severity: 'success', summary: 'Sucesso', detail: "Cadastrado"});
                    setObjetos(null);
                })
            }
            setObjetoDialog(false);
            setObjeto(objetoNovo);
        }
    }

    const editObjeto = (objeto) => {
        setObjeto({...objeto});
        setObjetoDialog(true);
    }

    const confirmDeleteObjeto = (objeto) => {
        objetoService.excluir(objeto.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Sucesso', detail: "Removido"});

            setObjetos(null);
            setObjetoDeleteDialog(false);
        })
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _objeto = {...objeto};
        _objeto[`${name}`] = val;

        setObjeto(_objeto);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className='my-2'>
                    <Button label="Novo Aluno" icon="pi pi-plus" className='p-button-success' onClick={openNew}/>
                </div>
            </React.Fragment>
        );
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>ID</span>
                {rowData.id}
            </>
        );
    }

    const nomeAlunoBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.nomeAluno}
            </>
        );
    }

    const cpfAlunoBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.cpfAluno}
            </>
        );
    }

    const emailAlunoBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.emailAluno}
            </>
        );
    }

    const telefoneAlunoBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.telefoneAluno}
            </>
        );
    }

    const observacaoAlunoBodyTemplate = (rowData) => {
        return (
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.observacaoAluno}
            </>
        );
    }


    const header = (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>Alunos Cadastrados</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)}/>
            </span>
        </div>
    )

    const objetoDialogFooter = (
        <>
            <Button label='Cancelar' icon="pi pi-times" className='p-button-text' onClick={hideDialog}/>
            <Button label='Salvar' icon='pi pi-checks' className='p-button-text' onClick={saveObjeto}/>
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label='Não' icon="pi pi-times" className='p-button-text' onClick={hideDeleteObjetoDialog}/>
            <Button label='Salvar' icon='pi pi-checks' className='p-button-text' onClick={confirmDeleteObjeto}/>
        </>
    )
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={objetos} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                               globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                        <Column field="id" header="id" sortable body={idBodyTemplate} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column field="nomeAluno" header="Nome" sortable body={nomeAlunoBodyTemplate()} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column field="cpfAluno" header="CPF" sortable body={cpfAlunoBodyTemplate()} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column field="emailAluno" header="Email" sortable body={emailAlunoBodyTemplate()} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column field="telefoneAluno" header="Telefone" sortable body={telefoneAlunoBodyTemplate()} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column field="observacaoAluno" header="Observação" sortable body={observacaoAlunoBodyTemplate()} headerStyle={{width: '14%', minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{width: '450px'}} footer={objetoDialogFooter} header="Cadastrar/Editar" modal className="p-fluid" onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nomeAluno">Nome</label>
                            <InputText id="nomeAluno" value={objeto.nomeAluno} onChange={(e) => onInputChange(e, 'nomeAluno')} required autoFocus className={classNames({'p-invalid': submitted && !objeto.nomeAluno})}/>
                            {submitted && !objeto.nomeAluno && <small className="p-invalid">Nome é requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cpfAluno">CPF</label>
                            <InputText id="cpfAluno" value={objeto.cpfAluno} onChange={(e) => onInputChange(e, 'cpfAluno')} required autoFocus className={classNames({'p-invalid': submitted && !objeto.cpfAluno})}/>
                            {submitted && !objeto.cpfAluno && <small className="p-invalid">Cpf é requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="emailAluno">Email</label>
                            <InputText id="emailAluno" value={objeto.emailAluno} onChange={(e) => onInputChange(e, 'emailAluno')} required autoFocus className={classNames({'p-invalid': submitted && !objeto.emailAluno})}/>
                            {submitted && !objeto.emailAluno && <small className="p-invalid">Email é requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="telefoneAluno">Telefone</label>
                            <InputText id="telefoneAluno" value={objeto.telefoneAluno} onChange={(e) => onInputChange(e, 'telefoneAluno')} required autoFocus className={classNames({'p-invalid': submitted && !objeto.telefoneAluno})}/>
                            {submitted && !objeto.telefoneAluno && <small className="p-invalid">Telefone é requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="observacaoAluno">Observação</label>
                            <InputText id="observacaoAluno" value={objeto.observacaoAluno} onChange={(e) => onInputChange(e, 'observacaoAluno')} autoFocus className={classNames({'p-invalid': submitted && !objeto.observacaoAluno})}/>
                            {submitted && !objeto.observacaoAluno && <small className="p-invalid">Sigla é requerida.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{width: '450px'}} header="Confirm" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {objeto && <span>tem certeza que quer excluir?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Aluno, comparisonFn);
