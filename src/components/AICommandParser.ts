interface Command {
  action: string;
  component: string;
  value?: string | number;
}

export const parseAICommand = (text: string): Command[] => {
  const commandRegex = /\[COMMAND:(.*?)\]/g;
  const commands: Command[] = [];
  
  let match;
  while ((match = commandRegex.exec(text)) !== null) {
    try {
      const [action, component, value] = match[1].split(':').map(s => s.trim());
      commands.push({
        action: action.toLowerCase(),
        component: component.toLowerCase(),
        value: value ? (isNaN(Number(value)) ? value : Number(value)) : undefined
      });
    } catch (error) {
      console.error('Error parsing command:', error);
    }
  }
  
  return commands;
};

export const executeCommand = (command: Command, thermalStore: any) => {
  const { action, component, value } = command;
  
  switch (action) {
    case 'toggle':
      if (thermalStore.components[component]) {
        thermalStore.setComponentActive(component, !thermalStore.components[component].active);
        return `${component} ${thermalStore.components[component].active ? 'ativado' : 'desativado'}`;
      }
      break;
      
    case 'setpower':
      if (thermalStore.components[component] && typeof value === 'number') {
        thermalStore.setComponentPower(component, value);
        return `Potência de ${component} ajustada para ${value}%`;
      }
      break;
      
    case 'status':
      if (thermalStore.components[component]) {
        const comp = thermalStore.components[component];
        return `Status de ${component}: ${comp.active ? 'Ativo' : 'Inativo'}, ${comp.power}% potência, ${comp.temperature}K`;
      }
      break;
  }
  
  return `Comando inválido ou componente não encontrado`;
};